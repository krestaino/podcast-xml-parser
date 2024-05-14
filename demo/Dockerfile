# Use an official Node runtime as the parent image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json first, for better caching
COPY package*.json ./

# Install dependencies and serve tool
RUN npm install
RUN npm install -g serve

# Copy the current directory contents into the container at /app
COPY . .

# Build the React app
RUN npm run build

# Command to serve the built app
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]
