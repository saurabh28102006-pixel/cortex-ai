import mongoose from "mongoose"

const DEFAULT_URI = "mongodb+srv://saurabh28102006_db_user:CortexAi123@cluster0.bsoubcb.mongodb.net/auth?retryWrites=true&w=majority"

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return
    }
    try {
        let uri = process.env.MONGODB_URI || DEFAULT_URI
        if (uri.includes("UHrBNvOptoNLn6zW")) {
            uri = uri.replace("UHrBNvOptoNLn6zW", "CortexAi123")
        }
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000
        }) 
        console.log("auth db connected successfully")
    } catch (error) {
        console.error("auth db connection error:", error.message)
    }
}

export default connectDb