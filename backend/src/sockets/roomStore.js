const rooms = new Map();

export function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Map(),
      code: "// start code here",
      language: "javascript",
    });
  }
  return rooms.get(roomId);
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function addUserToRoom(roomId, socketId, userName) {
  const room = getOrCreateRoom(roomId);
  room.users.set(socketId, userName);
  return room;
}

export function removeUserFromRoom(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  room.users.delete(socketId);

  // Clean up empty rooms to avoid memory leaks
  if (room.users.size === 0) {
    rooms.delete(roomId);
    return null;
  }

  return room;
}

export function getUsersInRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.users.values());
}

export function updateRoomCode(roomId, code) {
  const room = rooms.get(roomId);
  if (room) room.code = code;
}

export function updateRoomLanguage(roomId, language) {
  const room = rooms.get(roomId);
  if (room) room.language = language;
}
