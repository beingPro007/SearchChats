import { app } from './index.js';
import dbConnect from './db/mongoDbIndex.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({
  path: './env',
});

// Set up CORS
const allowedOrigins = [
  'http://localhost:3001/*',
  'https://chatgpt.com'
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Allow preflight requests for all routes
app.options('*', cors());

// Logging middleware for API requests
app.use('/api/v1/conversations', (req, res, next) => {
  console.log(`Received ${req.method} request for: ${req.url}`);
  next();
});

// Connect to MongoDB and start the server
dbConnect()
  .then(() => {
    app.on('Error', (error) => {
      console.error('Error occurred:', error);
      throw error;
    });

    // Start the server
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`🚀  Server is running on https://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Failed!!!', err);
  });

// General error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
