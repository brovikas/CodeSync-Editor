import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorPanel = ({ language, code, changeCode, runCode, output, isCompiling }) => {
  const [userInput, setUserInput] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2 sm:p-3">
      <div className="min-h-[40vh] flex-1 overflow-hidden border border-line sm:min-h-[50vh]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => changeCode(value ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:h-1/4">
        <textarea
          className="min-h-[6rem] flex-1 resize-none border border-line bg-paper p-2 font-mono text-sm text-ash placeholder-dim focus:border-moss-dim focus:outline-none sm:min-h-0"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter stdin input here..."
        />
        <textarea
          className="min-h-[6rem] flex-1 resize-none border border-line bg-paper p-2 font-mono text-sm text-ash placeholder-dim focus:border-moss-dim focus:outline-none sm:min-h-0"
          value={output}
          readOnly
          placeholder="Output will appear here..."
        />
      </div>

      <button
        type="button"
        onClick={() => runCode(userInput)}
        disabled={isCompiling}
        className="bg-moss-dim px-3 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-all hover:bg-moss hover:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] disabled:cursor-not-allowed disabled:bg-paper disabled:text-dim [clip-path:polygon(0_0,100%_0,100%_100%,1.2rem_100%)] disabled:[clip-path:none]"
      >
        {isCompiling ? "Running..." : "Run Code"}
      </button>
    </div>
  );
};

export default CodeEditorPanel;
