# CodeSync — Realtime Collaborative Code Editor

A real-time collaborative code editor where multiple users can join a shared room, write and edit code together, switch languages, see who's online and typing, and execute code through an external compiler API. Built with React, Tailwind CSS, Express, and Socket.IO.

Link : https://real-time-collaborative-editor-seven.vercel.app/

## Features

- Real-time, multi-user code editing with live sync across all participants
- Room-based sessions — share a room ID to collaborate instantly
- Live presence list showing everyone currently in the room
- "User is typing..." indicator
- Language switcher (JavaScript, Python, Java, C++) synced across the room
- In-browser code execution with stdin support and output console
- Responsive, dark "Shinobi" themed UI built with Tailwind CSS — desktop sidebar collapses to a mobile drawer
- Monaco Editor (the engine behind VS Code) for syntax highlighting and editing

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, Monaco Editor          |
| Backend     | Node.js, Express, Socket.IO                       |
| Realtime    | WebSockets via Socket.IO                          |
| Code Execution | [OnlineCompiler.io](https://onlinecompiler.io/) API |
| Deployment  | Frontend on Vercel, backend on Render |

---

## Project Structure

```
realtime-code-editor/
├── backend/
│   ├── src/
│   │   ├── config/env.js              # Environment variable loader
│   │   ├── services/executionService.js  # Code execution via OnlineCompiler.io
│   │   ├── sockets/roomStore.js       # In-memory room and user state
│   │   ├── sockets/socketHandlers.js  # All Socket.IO event logic
│   │   └── server.js                  # Express + Socket.IO bootstrap
│   ├── .env / .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/JoinRoom.jsx
    │   ├── components/Sidebar.jsx
    │   ├── components/CodeEditorPanel.jsx
    │   ├── hooks/useRoom.js           # Socket event wiring
    │   ├── config/socket.js           # Shared Socket.IO client instance
    │   ├── App.jsx
    │   └── main.jsx / index.css
    ├── tailwind.config.js             # Theme tokens (colors, fonts)
    ├── postcss.config.js
    ├── .env / .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A free API key from [OnlineCompiler.io](https://onlinecompiler.io/) (for code execution)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd realtime-code-editor
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Update `backend/.env`:

```
PORT=5000
CLIENT_URL=http://localhost:5173
EXECUTION_API_URL=https://api.onlinecompiler.io/api
EXECUTION_API_KEY=your_api_key_here
```

Without `EXECUTION_API_KEY`, the "Run Code" button returns a clear setup message instead of executing.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Update `frontend/.env`:

```
VITE_SERVER_URL=http://localhost:5000
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:5000`.

---

## How It Works

1. A user creates or joins a room using a unique room ID and display name.
2. The backend tracks each connection in a `Map<socketId, userName>` per room, so the user list and typing indicators stay accurate even with concurrent connections or duplicate names.
3. Code changes are broadcast to everyone in the room via Socket.IO and synced in real time.
4. Selecting "Run Code" sends the current code, language, and stdin input to the backend, which forwards it to the OnlineCompiler.io API and returns the output to everyone in the room.
5. Leaving a room or closing the tab removes the user from the room's presence list automatically.

---

## Deployment

This app has a stateful Socket.IO backend, so it's deployed as two separate services:

- **Frontend** (static build) → Vercel or Netlify
- **Backend** (persistent Node process) → Render, Railway, or Fly.io

### Backend (Render)

1. Push the repo to GitHub.
2. Create a new Web Service on Render, root directory `backend`.
3. Build command: `npm install` — Start command: `npm start`
4. Set environment variables: `EXECUTION_API_URL`, `EXECUTION_API_KEY`, `CLIENT_URL`

### Frontend (Vercel)

1. Import the repo on Vercel, root directory `frontend`.
2. Framework preset: Vite
3. Set environment variable: `VITE_SERVER_URL` to your deployed backend URL
4. Deploy, then update the backend's `CLIENT_URL` to match the deployed frontend URL and redeploy.

---

## Internship Context

> Developed as part of the **CodTech IT Solutions** internship program.
>
> **Intern:** Vikas Sharma | **ID:** CITS2901 | **Duration:** 4 Weeks

---
