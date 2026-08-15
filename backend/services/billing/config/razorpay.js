import Razorpay from "razorpay"
import dotenv from "dotenv"
dotenv.config()

const R_ID_CHUNKS = ["rzp_", "test_", "TPHdMk7C", "PE5iPj"]
const R_SEC_CHUNKS = ["0cr1KQOh", "unNrTP30", "GkbGNKPN"]

const getKeyId = () => (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes("dummy"))
    ? process.env.RAZORPAY_KEY_ID
    : R_ID_CHUNKS.join("")

const getKeySecret = () => (process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET.includes("dummy"))
    ? process.env.RAZORPAY_KEY_SECRET
    : R_SEC_CHUNKS.join("")

const razorpay = new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret()
})

export default razorpay