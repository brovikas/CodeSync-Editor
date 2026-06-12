import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  executionApiUrl:
    process.env.EXECUTION_API_URL || "https://api.onlinecompiler.io/api",
  executionApiKey: process.env.EXECUTION_API_KEY || "",
};
