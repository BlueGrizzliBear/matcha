# Use a lighter version of Node as a parent image
FROM node:16

# Set the working directory to /client
WORKDIR /client

# copy package.json into the container at /client
COPY package*.json .

# install dependencies
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Entrypoint is defined in .yml file