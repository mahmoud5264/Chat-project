# Base image
FROM node:alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install 

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 8000

# Start the app
CMD ["npm", "start"]