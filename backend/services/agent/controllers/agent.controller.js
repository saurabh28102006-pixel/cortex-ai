import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"

export const agent = async (req, res, next) => {
    try {
        const { prompt, conversationId, agent: selectedAgent } = req.body
        const file = req.file
        const userId = req.headers["x-user-id"] || "anonymous"
        const finalPrompt = (prompt || (file ? "Analyze attached file" : "")).trim()

        if (!finalPrompt && !file) {
            return res.status(400).json({ message: "Prompt or file is required" })
        }

        const chatServiceUrl = (process.env.CHAT_SERVICE && !process.env.CHAT_SERVICE.includes("localhost"))
            ? process.env.CHAT_SERVICE
            : "https://cortex-chat-dx0n.onrender.com"

        // Asynchronously persist user message without blocking AI start
        if (conversationId) {
            axios.post(`${chatServiceUrl}/save-message`, {
                conversationId,
                role: "user",
                content: finalPrompt
            }).catch(err => console.warn("Background user msg save:", err.message))
        }

        const result = await graph.invoke({
            prompt: finalPrompt,
            conversationId,
            agent: selectedAgent || "auto",
            userId,
            file
        })

        const aiResponse = result?.aiResponse || "No response generated."

        // Asynchronously persist assistant response
        if (conversationId) {
            addMessage(conversationId, "user", finalPrompt).catch(() => {})
            addMessage(conversationId, "assistant", aiResponse).catch(() => {})
            axios.post(`${chatServiceUrl}/save-message`, {
                conversationId,
                role: "assistant",
                content: aiResponse,
                images: result?.images || [],
                artifacts: result?.artifacts || []
            }).catch(err => console.warn("Background assistant msg save:", err.message))
        }

        return res.status(200).json({
            answer: aiResponse,
            images: result?.images || [],
            artifacts: result?.artifacts || []
        })
    } catch (error) {
        next(error)
    }
}