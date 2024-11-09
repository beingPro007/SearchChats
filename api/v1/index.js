import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(express.json());

const allowedOrigins=[
  'https://authenticationsfinal.vercel.app',
  'http://localhost:3000',
  'https://chatgpt.com',
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  })
);

app.options('*',cors());

app.use(cookieParser());

// Import and use your routes
import userRoute from './routes/user.routes.js';
import conversationRoute from './routes/conversation.routes.js';
import {verifyJWT} from './middlewares/verifyJwt.middlewares.js';
import {loginUser} from './controllers/User.controllers.js';

app.use('/api/v1/users',userRoute);
app.use('/api/v1/conversations',conversationRoute);

app.post('/api/v1/verify-jwt',verifyJWT);

export {app};