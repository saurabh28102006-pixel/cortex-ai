import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://saurabh28102006_db_user:CortexAi123@cluster0.bsoubcb.mongodb.net/chat"
        await mongoose.connect(uri) 
        console.log("chat db connected")
    } catch (error) {
        console.error("chat db connection error:", error.message)
    }
}

export default connectDb