import { app } from './index.js';
import dbConnect from './db/mongoDbIndex.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({
  path: './env',
});

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
