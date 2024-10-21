import { app } from './index.js';
import dbConnect from './db/mongoDbIndex.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({
  path: './env',
});


// Set up CORS
app.use(
  cors({
    origin: 'https://chatgpt.com', // Replace with the exact origin if needed
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure you allow necessary headers
    credentials: true,
  })
);

app.options('*', cors()); // Allow preflight requests

app.use('/api/v1/conversations', (req, res, next) => {
  console.log(`Received ${req.method} request for: ${req.url}`);
  next();
});

// Connect to MongoDB and start the server
dbConnect()
  .then(() => {
    app.on('Error', (error) => {
      console.log('Error occurred:', error);
      throw error;
    });

    // Create an HTTPS server using the certificate options
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `😁  Server is running on https://localhost:${process.env.PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection Failed!!!', err);
  });
