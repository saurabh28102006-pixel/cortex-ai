import mongoose from "mongoose"

const AGENT_DB_URI = "mongodb+srv://saurabh28102006_db_user:CortexAi123@cluster0.bsoubcb.mongodb.net/agent?retryWrites=true&w=majority"

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }
    
    const uri = (process.env.MONGODB_URI && process.env.MONGODB_URI.includes("CortexAi123"))
        ? process.env.MONGODB_URI
        : AGENT_DB_URI

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 6000
        }) 
        console.log("Agent MongoDB connected successfully to", conn.connection.name)
        return conn
    } catch (error) {
        console.error("Agent MongoDB connection error:", error.message)
        throw new Error(`MongoDB connection failed: ${error.message}`)
    }
}

export default connectDb