import axios from "axios";
import { config } from "../config/env.js";

const LANGUAGE_MAP = {
  javascript: { compiler: "typescript-deno", filename: "main.ts" },
  python: { compiler: "python-3.14", filename: "main.py" },
  java: { compiler: "openjdk-25", filename: "Main.java" },
  cpp: { compiler: "g++-15", filename: "main.cpp" },
};

/**
 * Executes code via the OnlineCompiler.io API
 */
export async function executeCode({ language, code, input }) {
  const mapping = LANGUAGE_MAP[language];

  if (!mapping) {
    return {
      success: false,
      output: `Unsupported language: ${language}`,
    };
  }

  if (!config.executionApiKey) {
    return {
      success: false,
      output:
        "Code execution is not configured. Set EXECUTION_API_KEY in backend/.env " +
        "(get a free key at https://onlinecompiler.io/).",
    };
  }

  try {
    const { data } = await axios.post(
      `${config.executionApiUrl}/run-code-sync/`,
      {
        compiler: mapping.compiler,
        code,
        input: input || "",
      },
      {
        headers: {
          Authorization: config.executionApiKey,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (data.status !== "success") {
      return {
        success: false,
        output: data.error || data.output || "Execution failed",
        stderr: data.error,
      };
    }

    return {
      success: true,
      output: data.output || "",
      stderr: data.error || "",
    };
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Execution failed";
    return {
      success: false,
      output: `Error: ${message}`,
    };
  }
}