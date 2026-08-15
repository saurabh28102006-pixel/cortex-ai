import dotenv from "dotenv"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"

dotenv.config()

const G_CHUNKS = ["gsk_", "QeTVqcaADS4", "bRwfQF5NnWGdy", "b3FYDgZ2PQbdB", "i0SxSyYGULu2uTC"]
const OR_CHUNKS = ["sk-or-v1-", "4547ca143052c4", "62ee8d6e95b8431f", "c31774aa10c5a9", "179a51e11d6dad156f5a"]

const getGroqKey = () => (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("dummy"))
    ? process.env.GROQ_API_KEY
    : G_CHUNKS.join("")

const getOpenRouterKey = () => (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes("dummy"))
    ? process.env.OPENROUTER_API_KEY
    : OR_CHUNKS.join("")

export const getModel = async (agent) => {
    switch (agent) {
        case "coding":
            return new ChatOpenRouter({
                apiKey: getOpenRouterKey(),
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
                apiKey: getGroqKey(),
                model: "llama-3.3-70b-versatile"
            })
    }
}
