import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import redis from "../../../shared/redis/redis.js"
import crypto from "crypto"
import connectDb from "../config/db.js"

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const login = async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        await connectDb()

        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name || "User",
                email: decoded.email || "",
                avatar: decoded.picture || ""
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(`user-session-${user._id}`, sessionId, "EX", 7 * 24 * 60 * 60)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        res.cookie("session", sessionId, COOKIE_OPTIONS)

        return res.status(200).json(user)
    } catch (error) {
        console.error("Auth login failed:", error)
        return res.status(500).json({ message: `Login error: ${error.message || error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }

        res.clearCookie("session", COOKIE_OPTIONS)
        return res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message || error}` })
    }
}

export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const addCredits = Number(credits) || 0
        user.plan = plan || user.plan
        user.credits = (user.credits || 0) + addCredits
        user.totalCredits = (user.totalCredits || 0) + addCredits
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        await user.save()

        const sessionId = await redis.get(`user-session-${user._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 7 * 24 * 60 * 60)
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        return res.status(500).json({ message: `Update user payment error: ${error.message || error}` })
    }
}

export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body

        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            vision: 10,
            image: 10
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const requiredCredits = COST[agent] || 1
        if ((user.credits || 0) < requiredCredits) {
            return res.status(400).json({ message: "Not enough credits." })
        }

        user.credits -= requiredCredits
        await user.save()

        const sessionId = await redis.get(`user-session-${user._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 7 * 24 * 60 * 60)
        }

        return res.status(200).json({ success: true, credits: user.credits })
    } catch (error) {
        return res.status(500).json({ message: `Deduct credits error: ${error.message || error}` })
    }
}
