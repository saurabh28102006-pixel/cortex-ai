import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import { waitForRedis } from "../../shared/redis/redis.js"
dotenv.config()

const port = process.env.PORT || 8001

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"hello from auth"})
})

const startServer = async () => {
    try {
        await connectDb()
        await waitForRedis()
        app.listen(port,()=>{
            console.log(`auth started at ${port}`)
        })
    } catch (error) {
        console.error("Failed to start auth service:", error)
        process.exit(1)
    }
}

startServer()
