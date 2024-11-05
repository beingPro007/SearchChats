# Step 1: Use the official Node.js image as a base
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application files to the container
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 3000

# Step 7: Define the command to run your application
CMD ["npm", "start"]
