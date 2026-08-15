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

        if (conversationId) {
            try {
                await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                    conversationId,
                    role: "user",
                    content: finalPrompt
                })
            } catch (err) {
                console.error("Failed to save user message to chat service:", err.message)
            }
        }

        const result = await graph.invoke({
            prompt: finalPrompt,
            conversationId,
            agent: selectedAgent || "auto",
            userId,
            file
        })

        const aiResponse = result?.aiResponse || "No response generated."

        if (conversationId) {
            try {
                await addMessage(conversationId, "user", finalPrompt)
                await addMessage(conversationId, "assistant", aiResponse)
                await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                    conversationId,
                    role: "assistant",
                    content: aiResponse,
                    images: result?.images || [],
                    artifacts: result?.artifacts || []
                })
            } catch (err) {
                console.error("Failed to save assistant message/memory:", err.message)
            }
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