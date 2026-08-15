import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://saurabh28102006_db_user:UHrBNvOptoNLn6zW@cluster0.bsoubcb.mongodb.net/auth"
        await mongoose.connect(uri) 
        console.log("auth db connected")
    } catch (error) {
        console.error("auth db connection error:", error.message)
    }
}

export default connectDb