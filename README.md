# Gibbr

Project for the Advanced Interaction Programming course DH2643


# Run the App Locally with Docker

## This project uses Docker and Docker Compose to run both the backend and frontend in separate containers.

### Prerequisites

- Docker installed (and running)

- Docker Compose (included with Docker Desktop)

### 1. Build and Start the Containers
From the root of the project, run:
`docker compose up --build`

This will:

Build the backend image from ./server

Build the frontend image from ./client

Start both containers and link them together

### 2. Access the App

Once the containers are running, open:

Frontend (Client) → `http://localhost:3000`

Backend (Server) → `http://localhost:9000`

The backend listens on port 8080 inside the container and is mapped to port 9000 on your local machine.
