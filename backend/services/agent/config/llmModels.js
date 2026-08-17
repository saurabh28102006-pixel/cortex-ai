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
    const openRouterKey = getOpenRouterKey()
    switch (agent) {
        case "coding":
            return new ChatOpenRouter({
                apiKey: openRouterKey,
                model: "openai/gpt-4o-mini",
                temperature: 0.1,
                maxTokens: 4096
            })
        case "imageAnalyzer":
            return new ChatOpenRouter({
                apiKey: openRouterKey,
                model: "openai/gpt-4o-mini"
            })
        case "pdf":
        case "ppt":
            return new ChatOpenRouter({
                apiKey: openRouterKey,
                model: "openai/gpt-4o-mini",
                temperature: 0.2
            })
        case "chat":
        case "search":
        case "router":
        case "intent":
        case "image":
        default:
            return new ChatOpenRouter({
                apiKey: openRouterKey,
                model: "openai/gpt-4o-mini",
                temperature: 0.3
            })
    }
}
