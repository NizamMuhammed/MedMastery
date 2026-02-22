# Medical SBA Learning App

A MERN stack application for Single Best Answer (SBA) medical questions.

## Features
- **Quiz Mode**: Practice SBA questions with immediate feedback and rationales.
- **Admin Panel**: Add new questions, options, and rationales.
- **Responsive UI**: Clean interface built with Tailwind CSS.
- **Offline Fallback**: Works with local MongoDB or falls back to in-memory storage if database is unavailable.

## Prerequisites
- Node.js
- MongoDB (optional, but recommended for persistence)

## Installation

1. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Configuration**
   - The server is configured to connect to `mongodb://localhost:27017/med_sba`.
   - You can change this in `server/.env`.

## Running the App

1. **Start the Backend Server**
   ```bash
   cd server
   node index.js
   ```
   *The server runs on http://localhost:5000*

2. **Start the Frontend Client**
   ```bash
   cd client
   npm run dev
   ```
   *The client runs on http://localhost:5173*

3. **Open Browser**
   - Go to `http://localhost:5173` to use the app.
   - Go to `http://localhost:5173/admin` to add questions.

## Troubleshooting
- If MongoDB is not running, the server will automatically switch to an in-memory database. Questions added will be lost when the server restarts.
