import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat'
  },
  featureType: {
    type: String,
    enum: ['text', 'image', 'resume'],
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
