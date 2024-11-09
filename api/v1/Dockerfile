# Use official Node.js image as the base image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies for the application
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file into the container
COPY .env .env

# Expose the port that the app will run on
EXPOSE 8080

# Install production dependencies
RUN npm install --only=production

# Run the application
CMD ["node", "server.js"]
