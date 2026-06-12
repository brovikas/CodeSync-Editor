import { useEffect, useState, useCallback } from "react";
import { socket } from "../config/socket";

export function useRoom() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    const handleUserJoined = (userList) => setUsers(userList);

    const handleCodeUpdate = (newCode) => setCode(newCode);

    const handleUserTyping = (name) => {
      setTypingUser(`${name} is typing...`);
      const timeout = setTimeout(() => setTypingUser(""), 1500);
      return () => clearTimeout(timeout);
    };

    const handleLanguageUpdate = (newLanguage) => setLanguage(newLanguage);

    const handleCompileStarted = () => {
      setIsCompiling(true);
      setOutput("Running...");
    };

    const handleCodeResponse = (response) => {
      setIsCompiling(false);
      setOutput(response.output ?? "No output");
    };

    socket.on("userJoined", handleUserJoined);
    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("userTyping", handleUserTyping);
    socket.on("languageUpdate", handleLanguageUpdate);
    socket.on("compileStarted", handleCompileStarted);
    socket.on("codeResponse", handleCodeResponse);

    return () => {
      socket.off("userJoined", handleUserJoined);
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("userTyping", handleUserTyping);
      socket.off("languageUpdate", handleLanguageUpdate);
      socket.off("compileStarted", handleCompileStarted);
      socket.off("codeResponse", handleCodeResponse);
    };
  }, []);

  // Notify server if the tab/window closes while still in a room
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (joined) socket.emit("leaveRoom");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [joined]);

  const joinRoom = useCallback(() => {
    if (!roomId.trim() || !userName.trim()) return;
    socket.emit("join", { roomId: roomId.trim(), userName: userName.trim() });
    setJoined(true);
  }, [roomId, userName]);

  const leaveRoom = useCallback(() => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    setUsers([]);
    setOutput("");
  }, []);

  const changeCode = useCallback(
    (newCode) => {
      setCode(newCode);
      socket.emit("codeChange", { roomId, code: newCode });
      socket.emit("typing", { roomId, userName });
    },
    [roomId, userName]
  );

  const changeLanguage = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      socket.emit("languageChange", { roomId, language: newLanguage });
    },
    [roomId]
  );

  const runCode = useCallback(
    (input) => {
      if (isCompiling) return;
      socket.emit("compileCode", {
        code,
        roomId,
        language,
        version: "*",
        input,
      });
    },
    [code, roomId, language, isCompiling]
  );

  return {
    joined,
    roomId,
    setRoomId,
    userName,
    setUserName,
    language,
    code,
    users,
    typingUser,
    output,
    isCompiling,
    joinRoom,
    leaveRoom,
    changeCode,
    changeLanguage,
    runCode,
  };
}
