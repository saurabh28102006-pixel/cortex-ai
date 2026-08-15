import dotenv from "dotenv"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"

dotenv.config()

export const getModel = async (agent) => {
    switch (agent) {
        case "coding":
            return new ChatOpenRouter({
                apiKey: process.env.OPENROUTER_API_KEY || "dummy-openrouter-key",
                model: "deepseek/deepseek-chat",
                temperature: 0,
                maxTokens: 2500
            })
        case "imageAnalyzer":
            return new ChatGoogleGenerativeAI({
                apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "dummy-gemini-key",
                model: "gemini-2.5-flash"
            })
        case "chat":
        case "search":
        case "pdf":
        case "ppt":
        case "router":
        default:
            return new ChatGroq({
                apiKey: process.env.GROQ_API_KEY || "dummy-groq-key",
                model: "openai/gpt-oss-120b"
            })
    }
}
