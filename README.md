# Habitura - Habit Tracking App

<img src="https://github.com/Anshul-AB/habitura/blob/main/frontend/src/assets/HabituraLogo.png?raw=true" alt="Logo or Banner Image" width="150" />

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Screenshots](#screenshots)
7. [API Documentation](#api-documentation)
8. [Getting Started with Docker](#getting-started-with-docker)
9. [License](#license)

## Introduction
**Habitura** is a data-driven habit and task management app that helps users create, track, and manage their daily routines and progress over time. With interactive charts and an intuitive UI, users can maintain streaks and visualize their productivity.

## Features
- 📅 **Daily Habit Tracking**: Create, update, and delete habits and tasks with ease.
- 📊 **Progress Charts**: Visualize your progress with Recharts for better habit tracking.
- 🗓️ **Responsive Calendar**: Manage your tasks through a real-time calendar.
- 🔒 **Authentication**: Secure login with JWT authentication (OAuth via Google also supported).
- 💾 **Caching with Redis**: Optimized data fetching using Redis for caching.

## Tech Stack
### Frontend
- React (v18+)
- Tailwind CSS
- Ant Design (for UI components)
- Recharts (for charts)
- React Big Calendar
- React Router
- React Toastify (for notifications)
- Google OAuth via `@react-oauth/google`

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT & Passport for authentication
- Redis for caching and rate-limiting
- Multer for file uploads
- Cron Jobs with Node-Cron for daily data processing

## Installation
### Prerequisites
- Node.js (v14 or later)
- MongoDB installed locally or an Atlas database
- Redis (for caching and rate-limiting) running in Docker.

### Clone the Repository
```bash
git clone https://github.com/Anshul-AB/habitura.git
cd habitura
```

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

### Environment Variables
Create a .env file in the root of the backend directory with the following keys:
```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=your_backend_port
```
# Frontend Keys

In your frontend code, you need to set up the following environment variables for Firebase and GitHub authentication.
Your `.env` file should look something like this:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_REDIRECT_URI=http://localhost:3000

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Run Redis in Docker
### You can run a Redis server in Docker using the following command:
```bash
docker run --name redis-server -d -p 6379:6379 redis
```

## Run the Application
### Frontend
```bash
npm run start
```
### Backend
```bash
nodemon
```

## Usage

1. Navigate to [http://localhost:3000](http://localhost:3000) to start using the app.
2. Register or log in via **Google or GitHub OAuth**.
3. Once logged in, start adding your tasks and habits to track your progress!

Enjoy using the app!

## Screenshots

## API Documentation

Habitura has a wide range of API endpoints for managing tasks and habits, such as:

- **Tasks:** Create, update, fetch, and delete tasks.
- **Habits:** Manage user habits, track streaks, and check progress.
- **Authentication:** Login and logout with Google and GitHub OAuth.

## Caching with Redis

Redis is used to cache frequently requested data such as habit lists. This reduces the load on the MongoDB server and improves the app's performance by providing faster access to cached data.

### Key Points:
- **Improved Performance:** Habit lists are cached to minimize repetitive database queries.
- **Reduced Load:** Reduces the number of requests to the MongoDB server by serving cached data.
- **Cache Invalidation:** Cached data is automatically refreshed when changes are made, ensuring users always see the most up-to-date information.

## Getting Started with Docker

You can run this habit tracking app using Docker to simplify setup. Follow the steps below:

### Prerequisites
- Make sure you have [Docker](https://www.docker.com/get-started) installed.

### Instructions

1. **Clone the Repository**
```bash
  git clone https://github.com/Anshul-AB/habitura.git
  cd habitura
```
  
2. **Build and Run Docker Containers**
```bash
   docker-compose up --build
```
3. **Access the App**
   - Open your browser and go to `http://localhost:5000` (or the port your app is configured to run on).

### Docker Hub Repository

If you'd like to pull the pre-built image directly from Docker Hub, visit: [Docker Hub - anshul100/habitura](https://hub.docker.com/r/anshul100/habitura)

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.





