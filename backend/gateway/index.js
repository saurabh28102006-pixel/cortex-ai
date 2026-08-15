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
    return proxy(target, {
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

app.use("/api/auth", createProxy(process.env.AUTH_SERVICE || "https://cortex-auth-6382.onrender.com"))
app.use("/api/chat", protect, createProxy(process.env.CHAT_SERVICE || "http://localhost:8002"))
app.use("/api/agent", protect, createProxy(process.env.AGENT_SERVICE || "http://localhost:8003"))
app.use("/api/billing", protect, createProxy(process.env.BILLING_SERVICE || "http://localhost:8004"))
app.get("/api/me", protect, getCurrentUser)

app.listen(port, () => {
    console.log(`gateway started at ${port}`)
})
