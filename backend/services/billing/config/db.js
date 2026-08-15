import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://saurabh28102006_db_user:CortexAi123@cluster0.bsoubcb.mongodb.net/billing"
        await mongoose.connect(uri) 
        console.log("billing db connected")
    } catch (error) {
        console.error("billing db connection error:", error.message)
    }
}

export default connectDb