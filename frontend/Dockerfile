FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Install ALL dependencies, including dev dependencies
RUN npm install --include=dev

# Copy the rest of the application code
COPY . .

# Build the React app with more verbose output
RUN npm run build || (echo "Build failed" && exit 1)

# Production environment
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 