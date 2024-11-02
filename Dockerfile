# Use the official Node.js image as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm cache clean --force
RUN npm rebuild node-gyp

RUN apt-get update && apt-get install -y \
    bash

RUN npm ci

# Copy the application files
COPY . .

RUN npm add --global nx@latest

