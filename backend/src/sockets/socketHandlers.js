import {
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  getOrCreateRoom,
  updateRoomCode,
  updateRoomLanguage,
} from "./roomStore.js";
import { executeCode } from "../services/executionService.js";

/**
 * Tracks which room each socket is currently in, since a socket
 * can only be reliably associated with state we attach to it.
 */
export function registerSocketHandlers(io, socket) {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", ({ roomId, userName }) => {
    if (!roomId || !userName) return;

    // If already in a room, leave it first
    leaveCurrentRoom(io, socket);

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.userName = userName;

    const room = getOrCreateRoom(roomId);
    addUserToRoom(roomId, socket.id, userName);

    // Send current code/language state to the newly joined user
    socket.emit("codeUpdate", room.code);
    socket.emit("languageUpdate", room.language);

    // Broadcast updated user list to everyone in the room
    io.to(roomId).emit("userJoined", getUsersInRoom(roomId));
  });

  socket.on("codeChange", ({ roomId, code }) => {
    if (!roomId) return;
    updateRoomCode(roomId, code);
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("typing", ({ roomId, userName }) => {
    if (!roomId || !userName) return;
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    if (!roomId || !language) return;
    updateRoomLanguage(roomId, language);
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("compileCode", async ({ code, roomId, language, version, input }) => {
    if (!roomId) return;

    // Let everyone in the room know execution started
    io.to(roomId).emit("compileStarted");

    const result = await executeCode({ language, code, input, version });

    io.to(roomId).emit("codeResponse", result);
  });

  socket.on("leaveRoom", () => {
    leaveCurrentRoom(io, socket);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    leaveCurrentRoom(io, socket);
  });
}

function leaveCurrentRoom(io, socket) {
  const { roomId } = socket.data;
  if (!roomId) return;

  socket.leave(roomId);
  removeUserFromRoom(roomId, socket.id);

  io.to(roomId).emit("userJoined", getUsersInRoom(roomId));

  socket.data.roomId = null;
  socket.data.userName = null;
}
