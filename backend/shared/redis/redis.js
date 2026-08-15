import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

redis.on("connect",()=>{
    console.log("redis connected")
})

redis.on("error", (err) => {
    console.error("Redis connection error:", err)
})

export const waitForRedis = (timeoutMs = 4000) => {
    return new Promise((resolve) => {
        if (redis.status === "ready") {
            return resolve()
        }
        const timer = setTimeout(() => {
            console.warn("Redis wait timed out, continuing server boot...")
            resolve()
        }, timeoutMs)

        redis.once("ready", () => {
            clearTimeout(timer)
            resolve()
        })
        redis.once("error", (err) => {
            console.warn("Redis initial warning:", err.message)
            clearTimeout(timer)
            resolve()
        })
    })
}

export default redis