import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { vectorStore } from "../config/vectorDb.js"
import { getModel } from "../config/llmModels.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf")
    if (!state.file || !state.file.path) {
      return {
        ...state,
        aiResponse: "No PDF file was provided to analyze."
      }
    }

    const buffer = fs.readFileSync(state.file.path)
    const pdf = new PDFParse({ data: buffer })
    const result = await pdf.getText()
    const text = result.text || ""

    if (!text.trim()) {
      return {
        ...state,
        aiResponse: "The uploaded PDF appears to be empty or contains only non-selectable text (scanned image)."
      }
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const docs = await splitter.createDocuments([text])
    const collectionName = `pdf-${Date.now()}`
    const store = await vectorStore(docs, collectionName)
    const relevantDocs = await store.similaritySearch(state.prompt || "summarize this document", 5)
    const context = relevantDocs.map(d => d.pageContent).join("\n\n")
    const llm = await getModel("pdf-rag")

    const messages = [
      new SystemMessage(`You are CortexAI PDF Assistant.

Rules:
- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply: "I couldn't find this information in the uploaded PDF."
- Use clean Markdown formatting.
`),
      new HumanMessage(`Context:\n${context}\n\nQuestion: ${state.prompt || "Summarize the key points of this PDF"}`)
    ]

    const response = await llm.invoke(messages)
    await deductCredits(state.userId, "pdf")

    return {
      ...state,
      aiResponse: response.content
    }
  } catch (error) {
    console.error("PDF RAG Error:", error)
    return {
      ...state,
      aiResponse: error?.data?.message || error?.message || "Failed to analyze PDF."
    }
  } finally {
    if (state.file?.path) {
      try {
        if (fs.existsSync(state.file.path)) {
          fs.unlinkSync(state.file.path)
        }
      } catch (e) {
        console.error("Failed to cleanup temp PDF:", e)
      }
    }
  }
}