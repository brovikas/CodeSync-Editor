import { useState } from "react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const Sidebar = ({
  roomId,
  users,
  typingUser,
  language,
  changeLanguage,
  leaveRoom,
  drawerOpen,
  onClose,
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  return (
    <>
      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          scrollbar-shinobi fixed inset-y-0 left-0 z-30 flex w-64 flex-col gap-3
          overflow-y-auto border-r border-line border-l-[3px] border-l-moss
          bg-panel p-4 transition-transform duration-200
          md:static md:z-auto md:w-64 md:translate-x-0
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <h2 className="mb-1 hidden font-serif text-lg tracking-wide text-ash md:block">
            <span className="text-moss">道</span> Code Room
          </h2>
          <p className="mb-2 break-all border border-line bg-paper px-2 py-1.5 text-xs text-dim">
            {roomId}
          </p>
          <button
            type="button"
            onClick={copyRoomId}
            className="border border-line bg-paper px-2 py-1.5 text-xs tracking-wide text-ash transition-colors hover:border-moss hover:text-moss"
          >
            Copy Room Id
          </button>
          {copySuccess && (
            <span className="ml-2 text-xs text-moss">{copySuccess}</span>
          )}
        </div>

        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-dim">
            Users in Room ({users.length})
          </h3>
          <ul className="scrollbar-shinobi flex max-h-36 flex-col gap-1 overflow-y-auto text-sm">
            {users.map((user, index) => (
              <li
                key={`${user}-${index}`}
                className="relative border border-line bg-paper px-2 py-1.5 pl-6 text-ash"
              >
                <span className="absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-moss shadow-[0_0_6px_theme(colors.moss.DEFAULT)]" />
                {user}
              </li>
            ))}
          </ul>
        </div>

        <p className="min-h-[1rem] text-xs italic text-moss">{typingUser}</p>

        <div>
          <label
            htmlFor="language-select"
            className="mb-1 block text-xs font-semibold uppercase tracking-widest text-dim"
          >
            Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full border border-line bg-paper px-2 py-2 text-sm text-ash focus:border-moss focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={leaveRoom}
          className="mt-auto border border-blade-dim bg-transparent px-2 py-2 text-sm text-blade-dim transition-colors hover:border-blade hover:bg-blade/10 hover:text-blade"
        >
          Leave Room
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
