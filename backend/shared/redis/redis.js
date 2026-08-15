import Redis from "ioredis"

const UPSTASH_REDIS_URL = "rediss://default:gQAAAAAAASvuAAIgcDE2YmRiYTM5NTI2NTg0MjA0OGQ5OTJiY2M2N2ZkZGMxMg@equipped-tortoise-76782.upstash.io:6379"
const redis = new Redis(process.env.REDIS_URL || UPSTASH_REDIS_URL)

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