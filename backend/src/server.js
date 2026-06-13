import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/env.js";
import { registerSocketHandlers } from "./sockets/socketHandlers.js";

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: config.clientUrl }));

const io = new Server(server, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve frontend build in production
const __dirname = path.resolve();
const frontendDist = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendDist));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

server.listen(config.port, () => {
  // console.log(`Server running on port ${config.port}`);
});
