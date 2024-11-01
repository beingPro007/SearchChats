import {app} from './index.js';
import dbConnect from './db/mongoDbIndex.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';

dotenv.config({path: './.env'}); // Ensure correct path for .env file

const CPU=os.cpus().length;

if(cluster.isPrimary) {
  // Master process - forks workers
  console.log(`Primary process running on PID: ${process.pid}`);

  for(let i=0;i<CPU;i++) {
    cluster.fork();
  }

  // Optional: Restart worker if it exits unexpectedly
  cluster.on('exit',(worker,code,signal) => {
    console.log(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process - connects to database and starts the server
  dbConnect()
    .then(() => {
      console.log('MongoDB connected successfully');

      // Global error handling middleware
      app.use((err,req,res,next) => {
        console.error('Global error handler:',err.stack);
        res.status(500).send('Something broke!');
      });

      const port=process.env.PORT||8000;
      app.listen(port,() => {
        console.log(`🚀 Worker ${process.pid} running server on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB Connection Failed:',err);
    });
}
