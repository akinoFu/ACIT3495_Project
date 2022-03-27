FROM node:latest

# Create app directory
WORKDIR /usr/src/data

# # Copy source code to /src/data in container
COPY package*.json /usr/src/data

# Install app and dependencies into /src/data in container
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY . /usr/src/data

EXPOSE 3002

#command to run within the container
CMD [ "node", "app2.js" ]