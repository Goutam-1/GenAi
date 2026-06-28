import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

/**
 * GET /conversations/text
 */
export const getTextConversations = async (req, res) => {
  try {
    const userEmail = req.userEmail || 'guest';
    const conversations = await Conversation.find({
      userEmail,
      featureType: 'text'
    }).sort({ createdAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching text conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

/**
 * GET /conversations/image
 */
export const getImageConversations = async (req, res) => {
  try {
    const userEmail = req.userEmail || 'guest';
    const conversations = await Conversation.find({
      userEmail,
      featureType: 'image'
    }).sort({ createdAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching image conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

/**
 * GET /conversations/resume
 */
export const getResumeConversations = async (req, res) => {
  try {
    const userEmail = req.userEmail || 'guest';
    const conversations = await Conversation.find({
      userEmail,
      featureType: 'resume'
    }).sort({ createdAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching resume conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

/**
 * GET /conversation/:id
 */
export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: id
    }).sort({ createdAt: 1 });

    res.json({
      conversation,
      messages
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

/**
 * DELETE /conversation/:id
 */
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: id });

    // Delete the conversation
    await Conversation.findByIdAndDelete(id);

    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};
