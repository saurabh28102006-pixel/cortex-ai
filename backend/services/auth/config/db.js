import mongoose from "mongoose"

const connectDb = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn("MONGODB_URI not provided")
            return
        }
        await mongoose.connect(process.env.MONGODB_URI) 
        console.log("auth db connected")
    } catch (error) {
        console.error("auth db connection error:", error.message)
    }
}

export default connectDb