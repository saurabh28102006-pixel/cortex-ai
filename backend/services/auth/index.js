import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import { waitForRedis } from "../../shared/redis/redis.js"
dotenv.config()

import cors from "cors"

const port = process.env.PORT || 8001

const app = express()
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"hello from auth"})
})

app.listen(port, () => {
    console.log(`auth started at ${port}`)
    connectDb().catch(err => console.error("Auth DB connection error:", err.message))
})
