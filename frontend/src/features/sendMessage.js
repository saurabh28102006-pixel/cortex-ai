
import api from '../../utils/axios'

async function sendMessage(payload) {
  try {
    const { data } = await api.post("/api/agent/chat", payload, {
      timeout: 180000
    })
    return data
  } catch (error) {
    console.error("SendMessage error:", error)
    if (error.response?.data?.message) {
      return { answer: `⚠️ ${error.response.data.message}` }
    }
    return null
  }
}

export default sendMessage
