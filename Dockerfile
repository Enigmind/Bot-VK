FROM node:latest

# Create app directory
WORKDIR /usr/src/bot

# Copy and install dependencies
COPY package*.json /usr/src/bot/
RUN npm ci

COPY . /usr/src/bot/

# deploy/updates slash commands
RUN node deploy-commands.js

CMD ["node", "anick.js"]
