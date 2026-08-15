import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv"
dotenv.config()

export const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "dummy_gemini_key",
    model: "gemini-embedding-001"
  });
};