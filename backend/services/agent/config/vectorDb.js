import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddings } from "./embeddings.js";
import dotenv from "dotenv"

dotenv.config()

export const vectorStore = async (docs, collectionName) => {
    const embeddings = getEmbeddings()
    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: process.env.QDRANT_URL || "https://dummy.qdrant.io:6333",
        apiKey: process.env.QDRANT_API_KEY || "dummy-qdrant-key",
        collectionName
    });
}