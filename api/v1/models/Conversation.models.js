import mongoose, { Schema } from 'mongoose';

const conversationSchema = new Schema(
  {
    conversationTitle: {
      type: String,
      required: [true, 'Conversation title is required'], // Custom error message for required field
      unique: true, // Ensure unique conversation titles
      trim: true, // Remove extra spaces
    },
    link: {
      type: String,
      required: [true, 'Link is required'],
      trim: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'First login to save your conversationsco']
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
