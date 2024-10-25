# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the application files
COPY . .

# Install the application dependencies
RUN npm install

# Install Nx globally and copy the rest of the monorepo files
RUN npm install -g nx

