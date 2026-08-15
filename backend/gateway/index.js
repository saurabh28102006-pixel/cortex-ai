import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"

dotenv.config()

const port = process.env.PORT || 8000
const app = express()

// Robust CORS & Preflight handler
app.use((req, res, next) => {
    const origin = req.headers.origin || "*"
    res.header("Access-Control-Allow-Origin", origin)
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, x-user-id")

    if (req.method === "OPTIONS") {
        return res.sendStatus(204)
    }
    next()
})

app.use(morgan("dev"))
app.use(cookieParser())

// Health check endpoint for Render
app.get("/", (req, res) => {
    res.json({ status: "healthy", service: "gateway", timestamp: new Date().toISOString() })
})
app.get("/health", (req, res) => {
    res.json({ status: "healthy" })
})

const createProxy = (targetUrl) => {
    const target = targetUrl || "http://localhost:8001"
    const isHttps = target.startsWith("https://")
    return proxy(target, {
        https: isHttps,
        preserveHostHdr: false,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts
        },
        userResHeaderDecorator: (headers, userReq) => {
            headers["Access-Control-Allow-Origin"] = userReq.headers.origin || "*"
            headers["Access-Control-Allow-Credentials"] = "true"
            return headers
        },
        proxyErrorHandler: (err, res) => {
            console.error(`Proxy error connecting to ${target}:`, err.message)
            return res.status(502).json({ message: "Service temporarily unavailable. Please verify service URLs.", error: err.message })
        }
    })
}

const authTarget = (process.env.AUTH_SERVICE && !process.env.AUTH_SERVICE.endsWith("cortex-auth.onrender.com") && !process.env.AUTH_SERVICE.includes("localhost"))
    ? process.env.AUTH_SERVICE
    : "https://cortex-auth-6382.onrender.com"

const chatTarget = (process.env.CHAT_SERVICE && !process.env.CHAT_SERVICE.endsWith("cortex-chat.onrender.com") && !process.env.CHAT_SERVICE.includes("localhost"))
    ? process.env.CHAT_SERVICE
    : "https://cortex-chat-dx0n.onrender.com"

const agentTarget = (process.env.AGENT_SERVICE && !process.env.AGENT_SERVICE.endsWith("cortex-agent.onrender.com") && !process.env.AGENT_SERVICE.includes("localhost"))
    ? process.env.AGENT_SERVICE
    : "https://cortex-agent-f04c.onrender.com"

const billingTarget = (process.env.BILLING_SERVICE && !process.env.BILLING_SERVICE.endsWith("cortex-billing.onrender.com") && !process.env.BILLING_SERVICE.includes("localhost"))
    ? process.env.BILLING_SERVICE
    : "https://cortex-billing-zs3c.onrender.com"

app.use("/api/auth", createProxy(authTarget))
app.use("/api/chat", protect, createProxy(chatTarget))
app.use("/api/agent", protect, createProxy(agentTarget))
app.use("/api/billing", protect, createProxy(billingTarget))
app.get("/api/me", protect, getCurrentUser)

app.listen(port, () => {
    console.log(`gateway started at ${port}`)
})
