import axios from "axios"

const CHAT_SERVICE_DEFAULT = "https://cortex-chat-dx0n.onrender.com"

export const getMessages = async (conversationId) => {
    if (!conversationId) return []
    try {
        const chatServiceUrl = (process.env.CHAT_SERVICE && !process.env.CHAT_SERVICE.includes("localhost"))
            ? process.env.CHAT_SERVICE
            : CHAT_SERVICE_DEFAULT
        const { data } = await axios.get(`${chatServiceUrl}/get-messages/${conversationId}`)
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.warn("Failed to get messages from chat service:", error.message)
        return []
    }
}