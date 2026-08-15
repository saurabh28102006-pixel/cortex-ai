import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddings } from "./embeddings.js";
import dotenv from "dotenv"

dotenv.config()

const FALLBACK_QDRANT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6ODE4NzIyMzQtNmYwOS00ZGJiLWI0MjUtMjZiNzNjNjkzODMzIn0._sJBGD40F_tOz_JSvVY5t9VoEaGhsz6anYUJMzbUZXA"
const FALLBACK_QDRANT_URL = "https://219feace-9b3a-4445-8acd-ca6a1993bd2a.eu-west-1-0.aws.cloud.qdrant.io"

export const vectorStore = async (docs, collectionName) => {
    const embeddings = getEmbeddings()
    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: (process.env.QDRANT_URL && !process.env.QDRANT_URL.includes("dummy"))
            ? process.env.QDRANT_URL
            : FALLBACK_QDRANT_URL,
        apiKey: (process.env.QDRANT_API_KEY && !process.env.QDRANT_API_KEY.includes("dummy"))
            ? process.env.QDRANT_API_KEY
            : FALLBACK_QDRANT_KEY,
        collectionName
    });
}