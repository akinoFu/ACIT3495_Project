FROM node:latest

# Create app directory
WORKDIR /usr/src/front

# # Copy source code to /src/webapp in container
COPY package*.json /usr/src/front

# Install app and dependencies into /src/webapp in container
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY . /usr/src/front

EXPOSE 3001

#command to run within the container
CMD [ "node", "app1.js" ]