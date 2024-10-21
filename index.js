import express from 'express';
import cors from 'cors'; // Import cors
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);
app.options('*', cors());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

//route imports

import userRoute from './routes/user.routes.js';
import conversationRoute from './routes/conversation.routes.js';

app.use('/api/v1/users', userRoute);
app.use('/api/v1/conversations', conversationRoute);

export { app };
