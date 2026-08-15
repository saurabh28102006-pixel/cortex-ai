import Conversation from "../models/coversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" })
    }

    const conversation = await Conversation.create({
      userId: userId,
      title: "New Chat"
    })

    return res.status(200).json(conversation)
  } catch (error) {
    return res.status(500).json({ message: `Create conversation error: ${error.message || error}` })
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" })
    }

    const conversations = await Conversation.find({
      userId: userId
    }).sort({ updatedAt: -1 })

    return res.status(200).json(conversations)
  } catch (error) {
    return res.status(500).json({ message: `Get conversations error: ${error.message || error}` })
  }
}

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body
    if (!id) {
      return res.status(400).json({ message: "Conversation ID is required" })
    }

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { title: title || "New Chat", updatedAt: new Date() },
      { new: true }
    )

    return res.status(200).json(conversation)
  } catch (error) {
    return res.status(500).json({ message: `Update conversation error: ${error.message || error}` })
  }
}

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images, artifacts } = req.body
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" })
    }

    const message = await Message.create({
      conversationId,
      content,
      role,
      images: images || [],
      artifacts: artifacts || []
    })

    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() })

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).json({ message: `Save message error: ${error.message || error}` })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" })
    }

    const messages = await Message.find({
      conversationId
    }).sort({ createdAt: 1 })

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(500).json({ message: `Get messages error: ${error.message || error}` })
  }
}


