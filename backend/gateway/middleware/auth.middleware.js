import redis from "../../shared/redis/redis.js"

const protect = async (req, res, next) => {
    try {
        const origin = req.headers.origin || "https://cortex-ai-9pnp.vercel.app"
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Credentials", "true")

        const sessionId = req.cookies?.session
        if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized: Please login" })
        }
        let session
        try {
            session = await redis.get(`session-${sessionId}`)
        } catch (rErr) {
            console.warn("Redis session lookup warning:", rErr.message)
        }
        
        if (!session) {
            return res.status(401).json({ message: "Session expired: Please login again" })
        }
        req.user = JSON.parse(session)
        next()
    } catch (error) {
        return res.status(500).json({ message: `Auth error: ${error.message || error}` })
    }
}

export default protect