# Task Manager App

A full-stack Task Management Web Application built using the MERN stack. The application allows users to securely register and log in, manage their personal tasks, track completion status, and organize their workflow efficiently.

### Setup Instructions
-- Prerequisites

Make sure you have the following installed on your system:

Node.js
npm
MongoDB (local installation or MongoDB Atlas)
Git
Clone the Repository
git clone https://github.com/Vishal05it/Task-Manager-App.git
cd Task-Manager-App

# Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file and add the required environment variables:

PORT=7000
MONGO_URI=Your_MongoDB_Connection_String
JWT_SECRET=Your_JWT_Secret

Start the backend server:

npm start

or

nodemon index.js

The backend will run on:

http://localhost:7000

# Frontend Setup

Open a new terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will run on:

http://localhost:5173

## Features

* User registration and login with JWT authentication
* Protected routes
* Create, view, update, and delete tasks
* Mark tasks as completed or pending
* Search and filter tasks
* Pagination support
* Responsive user interface
* Secure cookie-based authentication

## Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* MongoDB
* Mongoose

## Live Demo

Deployed Application:
https://task-manager-app-beta-rosy.vercel.app/

## GitHub Repository

https://github.com/Vishal05it/Task-Manager-App

## Author

Vishal Tiwari

Thank you for checking out the project. Feedback and suggestions are always welcome!
