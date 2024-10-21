import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Fuse from 'fuse.js';

const addConversations = asyncHandler(async (req, res, next) => {
  try {
    const { title, url } = req.body; // Get the data from the request body

    // Check if required fields are present
    if (!title || !url) {
      return res
        .status(400)
        .json(new ApiResponse(400, 'Title and URL are required', null));
    }

    console.log('Received Title:', title);
    console.log('Received URL:', url);

    // Here you can add logic to save the data to a database if needed

    // Send a response back with the received data
    res
      .status(200)
      .json(
        new ApiResponse(200, 'Thank you, I am working now!!!', { title, url })
      );
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch')); // Pass error to next middleware
  }
});


const findConversations = asyncHandler(async (req, res, _) => {
  const userId = req.user?._id;
  const { query: searchQuery } = req.body; // Extract 'query' from the request body

  try {
    // Check if user is logged in
    if (!userId) {
      throw new ApiError(400, 'User is not logged in!');
    }

    // Ensure that a search query is provided
    if (!searchQuery) {
      throw new ApiError(400, 'You must enter a search query!');
    }

    // Attempt to find a conversation that matches the user's exact search query
    const foundConversation = await Conversation.findOne({
      addedBy: userId,
      conversation: searchQuery, // Assuming 'conversation' is a field in the Conversation model
    });

    // If an exact match is found, return it
    if (foundConversation) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            'Conversation fetched successfully!',
            foundConversation
          )
        );
    }

    // If no exact match, perform a fuzzy search
    const options = {
      includeScore: true,
      threshold: 0.4, // Adjust the match threshold
      keys: ['conversation'], // Adjust the field to search in (make sure this matches your model field)
    };

    // Fetch all conversations (you might want to limit or paginate this in production)
    const allConversations = await Conversation.find({ addedBy: userId });
    const fuse = new Fuse(allConversations, options);

    // Perform the fuzzy search
    const result = fuse.search(searchQuery);

    // If no results from the fuzzy search, return an appropriate message
    if (result.length === 0) {
      throw new ApiError(400, 'No results found! Try a different keyword.');
    }

    // Map the search result items
    const matches = result.map((item) => item.item);

    // Return the fuzzy search results
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'Here are some matching conversations based on your query.',
          matches
        )
      );
  } catch (error) {
    // Handle any errors during the process
    res
      .status(500)
      .json(
        new ApiResponse(500, 'Error finding the conversations.', error)
      );
  }
});


export { findConversations, addConversations };
