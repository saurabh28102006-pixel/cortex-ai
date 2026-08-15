import { TavilySearch } from "@langchain/tavily";

export const getSearchTool = () => {
  return new TavilySearch({
    apiKey: process.env.TAVILY_API_KEY || "dummy_tavily_key",
    maxResults: 5,
    topic: "general",
    includeImages: true
  });
};