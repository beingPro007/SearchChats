import {app} from './index.js';
import dbConnect from './db/mongoDbIndex.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({path: './.env'}); // Ensure correct path for .env file

// Connect to MongoDB
dbConnect()
  .then(() => {
    console.log('MongoDB connected successfully');

    // Global error handling middleware
    app.use((err,req,res,next) => {
      console.error('Global error handler:',err.stack);
      res.status(500).send('Something broke!');
    });

    // Set port from environment variable or default to 8000
    const port=process.env.PORT||8000;

    // Start the server
    app.listen(port,'0.0.0.0',() => {
      console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Failed:',err);
  });

console.log("Server initialization complete.");
