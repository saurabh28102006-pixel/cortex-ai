import axios from "axios"

export const deductCredits = async (userId, agent) => {
    try {
        const authServiceUrl = process.env.AUTH_SERVICE || "https://cortex-auth-6382.onrender.com"
        const { data } = await axios.post(`${authServiceUrl}/deduct-credits`, { userId, agent })
        return data
    } catch (error) {
        console.warn("Deduct credits warning:", error.message)
        return null
    }
}