# Use the official Node.js image as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /app

# Copy the application files
COPY . .

# Install the application dependencies
RUN npm install

RUN npm install @rollup/rollup-linux-arm64-gnu -g

RUN npm run prisma:generate
