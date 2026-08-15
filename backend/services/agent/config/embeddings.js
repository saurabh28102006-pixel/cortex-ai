import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv"
dotenv.config()

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY || "dummy_gemini_key",
  model: "gemini-embedding-001"
});