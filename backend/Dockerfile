FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend code only
COPY ./backend ./backend

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["node", "backend/index.js"] 