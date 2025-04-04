# Instructions for Team Members

This document explains how to run the FifthKeys Platform on your local machine.

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EZASI/fifthkeys-new-demo.git
   cd fifthkeys
   ```

2. **Start the application using Docker:**

   ```bash
   docker compose up --build
   ```

   This will:
   - Build all Docker images
   - Start the MongoDB database
   - Start the backend server
   - Start the frontend server

3. **Access the application:**

   - Open your browser and navigate to: [http://localhost](http://localhost)
   - The backend API is available at: [http://localhost/api](http://localhost/api)
   - The health check endpoint is at: [http://localhost/health](http://localhost/health)

## Development Without Docker

If you prefer to run the application without Docker:

1. **Start the backend:**

   ```bash
   cd fifthkeys
   npm install
   npm run dev
   ```

   The backend will be available at [http://localhost:5001](http://localhost:5001)

2. **Start the frontend:**

   ```bash
   cd fifthkeys/frontend
   npm install
   npm start
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

- If you encounter a port conflict (EADDRINUSE error), find and kill the process using the port:
  ```bash
  lsof -i :5001  # Find the PID
  kill -9 [PID]  # Replace [PID] with the actual process ID
  ```

- If Docker isn't working, make sure Docker Desktop is running and that you've opened a new terminal window after starting it.

- For Docker-related issues, check the logs:
  ```bash
  docker compose logs
  ```

## GitHub Repository

1. **Add the repository to GitHub:**

   ```bash
   git remote add origin https://github.com/EZASI/fifthkeys-new-demo.git
   git push -u origin main
   ```

2. **Verify the push:**

   You can verify your current branch with:
   ```bash
   git branch --show-current
   ```

   If the branch is not `master`, you might need to push to the `master` branch instead:
   ```bash
   git push -u origin master
   ``` 