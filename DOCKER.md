# FifthKeys Platform - Docker Setup

This document provides instructions for running the FifthKeys Platform using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

   This will build the images for the first time and start the containers. Use this command when you've made changes to the code.

2. **Start the application (after it's been built):**

   ```bash
   docker-compose up
   ```

3. **Run the application in detached mode (in the background):**

   ```bash
   docker-compose up -d
   ```

4. **Stop the application:**

   ```bash
   docker-compose down
   ```

## Accessing the Application

Once the application is running:

- **Frontend:** Open your browser and navigate to `http://localhost` or `http://server-ip` if running on a remote server
- **Backend API:** Available at `http://localhost/api` or `http://server-ip/api`
- **Health Check:** Available at `http://localhost/health` or `http://server-ip/health`

## Sharing with Remote Team Members

For a remote team member to access the application running on your machine:

1. Make sure your computer is accessible from the internet (port forwarding on your router, etc.)
2. Share your public IP address with your team members
3. They can access the application by navigating to `http://your-public-ip`

Alternatively, you can deploy the application to a cloud provider:

1. Push your code to a Git repository
2. Have your cloud server pull the repository
3. Run `docker-compose up -d` on the server
4. Share the server's public IP or domain name with your team

## Logs and Troubleshooting

- **View logs from all containers:**
  ```bash
  docker-compose logs
  ```

- **View logs from a specific service:**
  ```bash
  docker-compose logs frontend
  docker-compose logs backend
  docker-compose logs mongodb
  ```

- **View logs in real-time (follow mode):**
  ```bash
  docker-compose logs -f
  ```

## Data Persistence

MongoDB data is persisted in a Docker volume named `mongodb_data`. This ensures that your data remains intact even if the containers are stopped or removed. 