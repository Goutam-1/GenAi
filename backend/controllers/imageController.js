import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { generateWithPollinations, generateWithHuggingFace } from "../services/imageService.js";

/**
 * GET /image
 * Generate image via Pollinations.ai and save to conversation history.
 */
export const generateImage = async (req, res) => {
  try {
    const { prompt, conversationId } = req.query;
    const userEmail = req.userEmail || 'guest';

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    console.log("Prompt:", prompt);

    let conversation = conversationId ? 
      await Conversation.findById(conversationId) : null;

    // Create new conversation if needed
    if (!conversation) {
      const title = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
      conversation = await Conversation.create({
        userEmail,
        title,
        featureType: 'image'
      });
    }

    // Save user prompt as message
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: prompt
    });

    const { imageUrl, seed } = generateWithPollinations(prompt);

    // Save image URL as assistant response
    await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: imageUrl
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversation._id, {
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      image: imageUrl,
      seed,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate image",
    });
  }
};

/**
 * GET /img
 * Generate image via HuggingFace SDXL Turbo (returns raw image bytes).
 */
export const generateImageHF = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const imageData = await generateWithHuggingFace(prompt);

    res.set("Content-Type", "image/jpeg");
    res.send(imageData);

  } catch (error) {
    console.error("HF error:", error?.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Image generation failed",
    });
  }
};
