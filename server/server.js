// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/chatgpt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define Conversation schema and model
const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  link: { type: String, required: true },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

// Route to save a conversation
app.post("/conversations", async (req, res) => {
  try {
    const { name, link } = req.body;

    // Check if a conversation with the same name already exists
    const existingConversation = await Conversation.findOne({ name });
    if (existingConversation) {
      return res
        .status(400)
        .send({ error: "Conversation name already exists." });
    }

    const newConversation = new Conversation({ name, link });
    await newConversation.save();
    res.status(201).send({ message: "Conversation saved successfully!" });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).send({ error: "Failed to save conversation." });
  }
});

// Route to search for conversations
app.get("/conversations/search", async (req, res) => {
  try {
    const { name } = req.query;
    const conversation = await Conversation.findOne({ name });

    if (!conversation) {
      return res.status(404).send({ error: "Conversation not found." });
    }

    res.send(conversation);
  } catch (error) {
    console.error("Error searching conversation:", error);
    res.status(500).send({ error: "Failed to search for conversation." });
  }
});

// Route to get all conversations (optional for testing)
app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.send(conversations);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch conversations." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
