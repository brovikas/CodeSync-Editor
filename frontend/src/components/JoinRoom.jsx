import { v4 as uuid } from "uuid";

const JoinRoom = ({ roomId, setRoomId, userName, setUserName, joinRoom }) => {
  const createRoomId = () => setRoomId(uuid());

  const handleKeyDown = (e) => {
    if (e.key === "Enter") joinRoom();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink bg-[radial-gradient(circle_at_15%_20%,rgba(111,174,95,0.05),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(196,69,69,0.04),transparent_40%)] px-4">
      <div className="flex w-full max-w-sm flex-col gap-3 border border-line border-l-[3px] border-l-moss bg-panel px-6 py-10 shadow-2xl shadow-black/50 sm:px-8">
        <h1 className="mb-2 text-center font-serif text-2xl tracking-wide text-ash">
          <span className="text-moss">切</span> Join Code Room
        </h1>

        <input
          type="text"
          placeholder="Room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-line bg-paper px-3 py-2.5 text-sm text-ash placeholder-dim transition-colors focus:border-moss focus:outline-none"
        />


        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-line bg-paper px-3 py-2.5 text-sm text-ash placeholder-dim transition-colors focus:border-moss focus:outline-none"
        />

        <button
          type="button"
          onClick={createRoomId}
          className="border border-line bg-paper px-3 py-2.5 text-xs tracking-wide text-ash transition-colors hover:border-moss hover:text-moss"
        >
          Generate Room Id
        </button>
        
        <button
          type="button"
          onClick={joinRoom}
          disabled={!roomId.trim() || !userName.trim()}
          className="bg-moss-dim px-3 py-2.5 text-xs font-semibold tracking-wide text-ink transition-colors hover:bg-moss disabled:cursor-not-allowed disabled:bg-paper disabled:text-dim disabled:opacity-50"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
