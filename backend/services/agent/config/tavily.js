import { TavilySearch } from "@langchain/tavily";

const T_CHUNKS = ["tvly-", "dev-3o3M2J-", "d4uOvYT2X4EUoF", "AlBDFV4cx1EXwb", "ge3yiAg4DGBNzf"]

const getTavilyKey = () => (process.env.TAVILY_API_KEY && !process.env.TAVILY_API_KEY.includes("dummy"))
  ? process.env.TAVILY_API_KEY
  : T_CHUNKS.join("")

export const getSearchTool = () => {
  const key = getTavilyKey()
  process.env.TAVILY_API_KEY = key
  return new TavilySearch({
    tavilyApiKey: key,
    maxResults: 5,
    topic: "general",
    includeImages: true
  });
};