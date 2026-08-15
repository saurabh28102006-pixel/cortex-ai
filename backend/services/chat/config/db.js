import mongoose from "mongoose"

const connectDb = async () => {
    try {
        let uri = process.env.MONGODB_URI || "mongodb+srv://saurabh28102006_db_user:CortexAi123@cluster0.bsoubcb.mongodb.net/chat"
        if (uri.includes("UHrBNvOptoNLn6zW")) {
            uri = uri.replace("UHrBNvOptoNLn6zW", "CortexAi123")
        }
        await mongoose.connect(uri) 
        console.log("chat db connected")
    } catch (error) {
        console.error("chat db connection error:", error.message)
    }
}

export default connectDb