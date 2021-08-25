# Use a lighter version of Node as a parent image
FROM node:16-alpine

# Set the working directory to /api
WORKDIR /api

# copy package.json into the container at /api
COPY package*.json /api/

# install dependencies
RUN npm install

# install MySQL client package to test db connection
RUN apk update && apk add mysql-client

# Copy the current directory contents into the container at /api
COPY . /api/

# Make port 80 available to the world outside this container
EXPOSE 80

# Entrypoint is defined in .yml file