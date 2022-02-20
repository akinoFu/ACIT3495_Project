FROM node:latest

# Create app directory
WORKDIR /usr/src/webapp

# # Copy source code to /src/webapp in container
COPY package*.json /usr/src/webapp

# Install app and dependencies into /src/webapp in container
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY . /usr/src/webapp

EXPOSE 8001

#command to run within the container
CMD [ "node", "server.js" ]