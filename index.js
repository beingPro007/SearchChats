import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3001',
  'https://2963-152-59-32-19.ngrok-free.app',
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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


// Import and use your routes
import userRoute from './routes/user.routes.js';
import conversationRoute from './routes/conversation.routes.js';

app.use('/api/v1/users', userRoute);
app.use('/api/v1/conversations', conversationRoute);

export { app };
