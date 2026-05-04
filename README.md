# Automated Bug Triage & Tracking System

A full-stack SaaS application built with React, Node.js, Express, and MongoDB. It features an AI triage engine that automatically categorizes bugs and predicts severity/priority based on the content of the report.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, Recharts, @hello-pangea/dnd
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT Auth

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Make sure you have MongoDB running locally on `mongodb://localhost:27017` or update the `MONGO_URI` with your connection string.*
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Usage
1. Go to `http://localhost:5173` in your browser.
2. Sign up as a new user.
3. Submit a bug report using keywords like "crash", "slow", "API timeout", or "UI alignment" to see the AI triage in action.
4. Go to the Kanban board to drag and drop bugs between statuses.
