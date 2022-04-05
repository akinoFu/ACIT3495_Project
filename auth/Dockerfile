FROM node:latest

# Create app directory
WORKDIR /usr/src/auth

# # Copy source code to /src/auth in container
COPY package*.json /usr/src/auth

# Install app and dependencies into /src/auth in container
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY . /usr/src/auth

EXPOSE 3000

#command to run within the container
CMD [ "node", "server.js" ]