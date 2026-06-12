# Realtime Code Editor

A collaborative, real-time code editor where multiple users can join a room, edit code together, switch languages, and execute code via an external execution API. Styled with Tailwind CSS in a dark "Shinobi" theme, fully responsive (sidebar becomes a slide-out drawer on mobile).

## Project Structure

```
realtime-code-editor/
├── backend/
│   ├── src/
│   │   ├── config/env.js          # env var loader
│   │   ├── services/executionService.js  # code execution (with error handling)
│   │   ├── sockets/roomStore.js   # in-memory room/user state
│   │   ├── sockets/socketHandlers.js  # all socket.io event logic
│   │   └── server.js              # express + socket.io bootstrap
│   ├── .env / .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/JoinRoom.jsx
    │   ├── components/Sidebar.jsx
    │   ├── components/CodeEditorPanel.jsx
    │   ├── hooks/useRoom.js        # all socket event wiring
    │   ├── config/socket.js        # shared socket instance
    │   ├── App.jsx
    │   └── main.jsx / index.css
    ├── tailwind.config.js          # Shinobi theme tokens (colors, fonts)
    ├── postcss.config.js
    ├── .env / .env.example
    └── package.json
```

## Bugs Fixed

1. **Code not executing**
   - The public Piston API (`emkc.org`) went whitelist-only as of Feb 2026 and is no longer usable.
   - Switched to [OnlineCompiler.io](https://onlinecompiler.io/) — free tier (up to 1M requests/month), single REST call (`POST /api/run-code/`), supports JS/Python/Java/C++.
   - Sign up for a free API key and put it in `backend/.env` as `EXECUTION_API_KEY`. Without it, the server returns a helpful error in the output console instead of failing silently.
   - Added try/catch around the call so failures return a readable error message.
   - Added a `compileStarted` event so the UI shows "Running..." and disables the Run button while waiting.

2. **Joined users not shown**
   - Backend previously tracked users by `userName` in a `Set`, keyed loosely and reset on every `join` for *all* prior rooms via shared `currentRoom`/`currentUser` closures — this broke with concurrent connections.
   - Now each room tracks users in a `Map<socketId, userName>`, so each connection is independent and the user list updates correctly on join/leave/disconnect.

3. **"User is typing" not showing**
   - The frontend was slicing `user.slice(0, 8)` assuming UUID-like values, but `userName` is a plain string — `slice(0,8)` could cut names short or behave oddly, and the timeout cleanup wasn't isolated per event.
   - Now emits the full username and displays `"<name> is typing..."`, clearing after 1.5s.

4. **Hardcoded socket URL**
   - `io("http://localhost:5000")` hardcoded in frontend — now uses `VITE_SERVER_URL` env var.

5. **CORS**
   - Backend now restricts CORS to `CLIENT_URL` from env instead of `origin: "*"`, and applies it to both Express and Socket.IO.

6. **Room cleanup**
   - Empty rooms are deleted from memory to avoid unbounded growth.

## Setup

### Code Execution API

1. Sign up for a free account at https://onlinecompiler.io/
2. Get your API key from the dashboard
3. Add it to `backend/.env` as `EXECUTION_API_KEY=your_key_here`

Without this key set, the "Run Code" button will return an explanatory error instead of executing.

### Backend

```bash
cd backend
cp .env.example .env   # adjust if needed
npm install
npm run dev            # or npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env   # adjust if needed
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## Production Build

```bash
cd frontend
npm run build
```

This outputs to `frontend/dist`, which the Express server serves automatically (see `backend/src/server.js`).

Then run the backend:

```bash
cd backend
npm start
```
