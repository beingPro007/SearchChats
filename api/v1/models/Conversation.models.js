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
      required: [true, 'Link is required'], // Custom error message for required field
      trim: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User', // Ensure that each conversation is tied to a user
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
