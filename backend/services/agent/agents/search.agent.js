import { checkAgentLimit } from "../config/agentLimit.js"
import { getSearchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js"

export const searchAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "search")
        const searchTool = getSearchTool()
        const results = await searchTool.invoke({
            query: state.prompt
        })
        await deductCredits(state.userId, "search")
        console.log(results)
        return {
            ...state,
            searchResults: results,
            images: results.images || []
        }
    } catch (error) {
        console.error("Search agent error:", error)
        return {
            ...state,
            searchResults: [],
            images: [],
            aiResponse: error?.data?.message || error?.message || "Failed to search."
        }
    }
}