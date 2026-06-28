import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { generateContent } from "../services/geminiService.js";

/**
 * POST /chat
 */
export const chat = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    const userEmail = req.userEmail || 'guest';
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt cannot be empty" });
    }

    let conversation = conversationId ? 
      await Conversation.findById(conversationId) : null;

    // Create new conversation if needed
    if (!conversation) {
      const title = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
      conversation = await Conversation.create({
        userEmail: userEmail || 'guest',
        title,
        featureType: 'text'
      });
    }

    // Save user prompt as message
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: prompt
    });

    console.log(prompt);
    const text = await generateContent(prompt);

    // Save assistant response as message
    await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: text
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversation._id, {
      updatedAt: new Date()
    });

    res.json({
      response: text,
      conversationId: conversation._id
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      error: "Chat request failed",
    });
  }
};
