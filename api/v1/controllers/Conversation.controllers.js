import { Conversation } from '../models/Conversation.models.js'
import { ApiError } from '../utils/ApiErrors.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import Fuse from 'fuse.js';

const addConversations = asyncHandler(async (req, res, next) => {
  try {
    const { title, url } = req.body;

    // Skip specific titles or URLs
    if (title === 'Chatgpt' || url === 'https://chatgpt.com') {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            'Conversation with this title or URL is not allowed',
            null
          )
        );
    }

    // Validate required fields
    if (!title || !url) {
      return res
        .status(400)
        .json(new ApiResponse(400, 'Title and URL are required', null));
    }

    console.log('Received Title:', title);
    console.log('Received URL:', url);

    // Check if conversation already exists
    const existedConversation = await Conversation.findOne({
      conversationTitle: title,
    });
    if (existedConversation) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            'You already have this conversation earlier!',
            existedConversation
          )
        );
    }
    
    const createdConversation = await Conversation.create({
      conversationTitle: title,
      link: url,
    });

    if (!createdConversation) {
      return next(new ApiError(500, 'Error saving the conversation'));
    }

    // Successfully created
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          'Conversation added successfully',
          createdConversation
        )
      );
  } catch (error) {
    console.error('Error details:', error); // Log error details
    next(new ApiError(500, 'Failed to add conversation')); // Pass error to middleware
  }
});

const findConversations = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { query: searchQuery } = req.body;

  try {
    if (!userId) {
      throw new ApiError(401, 'User is not logged in!');
    }

    if (!searchQuery) {
      throw new ApiError(400, 'You must enter a search query!');
    }

    const foundConversation = await Conversation.findOne({
      addedBy: userId,
      conversation: searchQuery,
    });

    if (foundConversation) {
      return res.status(200).json(new ApiResponse(200, 'Conversation fetched successfully!', foundConversation));
    }

    const options = {
      includeScore: true,
      threshold: 0.4,
      keys: ['conversation'],
    };

    const allConversations = await Conversation.find({ addedBy: userId });
    const fuse = new Fuse(allConversations, options);
    const result = fuse.search(searchQuery);

    if (result.length === 0) {
      throw new ApiError(404, 'No results found! Try a different keyword.');
    }

    const matches = result.map(item => item.item);

    res.status(200).json(new ApiResponse(200, 'Here are some matching conversations based on your query.', matches));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error finding the conversations.', error));
  }
});

export { findConversations, addConversations };
