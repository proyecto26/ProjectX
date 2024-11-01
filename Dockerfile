# Use the official Node.js image as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /app

# Copy the application files
COPY . .

RUN npm add --global nx@latest

# Install the application dependencies
RUN npm install

