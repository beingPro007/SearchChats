# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./api/v1/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy the rest of your application code
COPY ./api/v1 .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
