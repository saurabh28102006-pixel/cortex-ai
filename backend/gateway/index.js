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

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-user-id"]
}))
app.use(morgan("dev"))
app.use(cookieParser())

// Health check endpoint for Render
app.get("/", (req, res) => {
    res.json({ status: "healthy", service: "gateway", timestamp: new Date().toISOString() })
})
app.get("/health", (req, res) => {
    res.json({ status: "healthy" })
})

app.use("/api/auth", proxy(process.env.AUTH_SERVICE || "http://localhost:8001"))
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE || "http://localhost:8002"))
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE || "http://localhost:8003"))
app.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE || "http://localhost:8004"))
app.get("/api/me", protect, getCurrentUser)

app.listen(port, () => {
    console.log(`gateway started at ${port}`)
})
