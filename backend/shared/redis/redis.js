import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

redis.on("connect",()=>{
    console.log("redis connected")
})

redis.on("error", (err) => {
    console.error("Redis connection error:", err)
})

export const waitForRedis = () => {
    return new Promise((resolve, reject) => {
        if (redis.status === "ready") {
            return resolve()
        }
        redis.once("ready", resolve)
        redis.once("error", reject)
    })
}

export default redis