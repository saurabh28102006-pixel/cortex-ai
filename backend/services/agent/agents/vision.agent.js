import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
export const visionAgent=async (state) => {

    try {
        await checkAgentLimit(state.userId,"image")
         const llm=await getModel("image")
    const res=await llm.invoke(`
        You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}

        `)

const prompt = res.content.trim()
const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

let downloadUrl = imageUrl
try {
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 15000 })
    await deductCredits(state.userId, "vision")
    const buffer = Buffer.from(imageRes.data)
    const filename = `image-${Date.now()}.png`
    await uploadToS3(filename, buffer, "image/png")
    downloadUrl = await getFromS3(filename, 24 * 60)
} catch (s3Err) {
    console.warn("S3 upload fallback for vision, using direct image URL:", s3Err.message)
    await deductCredits(state.userId, "vision")
}

return {
    ...state,
    images: [downloadUrl],
    aiResponse: `
![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})
`
}
    } catch (error) {
       console.error("Vision agent error:", error)
         return {
            ...state,
            aiResponse: error?.data?.message || error?.message || "Failed to generate image"
        }
    }
   


}