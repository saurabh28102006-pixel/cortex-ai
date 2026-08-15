import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMessages.js"

export const getMemory = async (conversationId) => {
    if (!conversationId) return []
    const key = `messages-${conversationId}`
    try {
        const cached = await redis.get(key)
        if (cached) {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed)) return parsed
        }
    } catch (e) {
        console.warn("Redis getMemory warning:", e.message)
    }
    
    const messages = await getMessages(conversationId)
    const safeMessages = Array.isArray(messages) ? messages : []
    try {
        await redis.set(key, JSON.stringify(safeMessages), "EX", 24 * 60 * 60)
    } catch (e) {
        console.warn("Redis setMemory warning:", e.message)
    }
    
    return safeMessages
}

export const addMessage = async (conversationId, role, content) => {
    if (!conversationId) return
    const key = `messages-${conversationId}`
    try {
        const rawMessages = await redis.get(key)
        const messages = rawMessages ? JSON.parse(rawMessages) : []
        const safeMessages = Array.isArray(messages) ? messages : []
        safeMessages.push({ role, content })

        if (safeMessages.length > 20) {
            safeMessages.shift()
        }

        await redis.set(key, JSON.stringify(safeMessages), "EX", 24 * 60 * 60)
    } catch (e) {
        console.warn("Redis addMessage warning:", e.message)
    }
}

