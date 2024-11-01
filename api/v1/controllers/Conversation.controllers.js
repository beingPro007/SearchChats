import {Conversation} from '../models/Conversation.models.js'
import {ApiError} from '../utils/ApiErrors.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import Fuse from 'fuse.js';

const addConversations=asyncHandler(async (req,res,next) => {
  try {
    const {title,url,user}=req.body;

    console.log(req.body);
    console.log(user);

    // Validate User Authentication
    if(!user||!user.username) {
      console.log('User is not logged in or user data is missing');
      return res
        .status(401)
        .json(new ApiResponse(401,'User authentication required',null));
    }

    // Prevent Disallowed Title or URL
    if(title==='ChatGPT'||url==='https://chatgpt.com') {
      return res
        .status(200)
        .json(new ApiResponse(200,'Conversation with this title or URL is not allowed',null));
    }

    // Validate Required Fields
    if(!title||!url) {
      console.warn('Title and URL are required');
      return res
        .status(400)
        .json(new ApiResponse(400,'Title and URL are required',null));
    }

    console.log('Received Title:',title);
    console.log('Received URL:',url);

    // Check for Existing Conversation
    const existedConversation=await Conversation.findOne({
      conversationTitle: title,
    });

    if(existedConversation) {
      console.log('Conversation already exists');
      return res
        .status(200)
        .json(new ApiResponse(200,'You already have this conversation!',existedConversation));
    }

    // Create a New Conversation
    const createdConversation=await Conversation.create({
      conversationTitle: title,
      link: url,
      addedBy: user,
    });

    if(!createdConversation) {
      console.error('Failed to save the conversation');
      return next(new ApiError(500,'Error saving the conversation'));
    }

    // Successfully Created
    console.log('Conversation added successfully:',createdConversation);
    res
      .status(201)
      .json(new ApiResponse(201,'Conversation added successfully',createdConversation));

  } catch(error) {
    console.error('Error details:',error);
    next(new ApiError(500,'Failed to add conversation')); // Pass error to middleware
  }
});

const findConversations=asyncHandler(async (req,res) => {
  // Extract user and searchQuery from req.body
  const {user,searchQuery}=req.body;
  const userId=user?._id;

  console.log("Request Body:",req.body);
  console.log("User ID:",userId);

  try {
    if(!userId) {
      return res.status(400).json(new ApiResponse(400,"User ID is not available"));
    }

    if(!searchQuery) {
      return new ApiError(400,'You must enter a search query!');
    }

    const foundConversation=await Conversation.findOne({
      addedBy: userId,
      conversation: searchQuery,
    });

    if(foundConversation) {
      return res.status(200).json(new ApiResponse(200,'Conversation fetched successfully!',foundConversation));
    }

    const options={
      includeScore: true,
      threshold: 0.4,
      keys: ['conversationTitle'],
    };

    const allConversations=await Conversation.find({addedBy: userId});
    console.log(allConversations);
    const fuse=new Fuse(allConversations,options);
    const result=fuse.search(searchQuery);
    console.log('I am under result',result)

    if(result.length===0) {
      throw new ApiError(404,'No results found! Try a different keyword.');
    }

    return res.status(200).json(new ApiResponse(200,'Here are some matching conversations based on your query.',result));
  } catch(error) {
    console.error("Error finding conversations:",error);
    return res.status(500).json(new ApiResponse(500,'Error finding the conversations.',error.message));
  }
});

export {findConversations,addConversations};