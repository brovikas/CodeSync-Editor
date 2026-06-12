import { useState } from "react";
import JoinRoom from "./components/JoinRoom.jsx";
import Sidebar from "./components/Sidebar.jsx";
import CodeEditorPanel from "./components/CodeEditorPanel.jsx";
import { useRoom } from "./hooks/useRoom.js";

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
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
  } = useRoom();

  if (!joined) {
    return (
      <JoinRoom
        roomId={roomId}
        setRoomId={setRoomId}
        userName={userName}
        setUserName={setUserName}
        joinRoom={joinRoom}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-ink md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 md:hidden">
        <h2 className="font-serif text-base tracking-wide text-ash">
          <span className="text-moss">道</span> Code Room
        </h2>
        <button
          type="button"
          onClick={() => setDrawerOpen((open) => !open)}
          className="border border-line px-3 py-1.5 text-xs tracking-wider text-ash transition-colors hover:border-moss hover:text-moss"
        >
          {drawerOpen ? "Close" : "Room Info"}
        </button>
      </div>

      <Sidebar
        roomId={roomId}
        users={users}
        typingUser={typingUser}
        language={language}
        changeLanguage={changeLanguage}
        leaveRoom={leaveRoom}
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <CodeEditorPanel
        language={language}
        code={code}
        changeCode={changeCode}
        runCode={runCode}
        output={output}
        isCompiling={isCompiling}
      />
    </div>
  );
};

export default App;
