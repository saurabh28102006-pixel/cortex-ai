import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import sendMessage from '../features/sendMessage'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages, isLoading } = useSelector(state => state.message)
    const bottomRef = useRef(null)
    const dispatch = useDispatch()
   
    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        })
    }, [messages?.length, isLoading])

    const handleSuggestionClick = async (promptText) => {
        if (isLoading) return
        dispatch(setIsLoading(true))
        let conversation = selectedConversation

        if (!conversation) {
            dispatch(setMessages([]))
            const conv = await createConversation()
            if (conv && conv._id) {
                dispatch(setSelectedConversation(conv))
                dispatch(addConversation(conv))
                conversation = conv
            }
        }

        if (conversation && conversation.title === "New Chat") {
            await updateConversation({ id: conversation?._id, title: promptText.slice(0, 40) })
            dispatch(setConvTitle({ conversationId: conversation?._id, title: promptText.slice(0, 40) }))
        }

        const formData = new FormData()
        formData.append("prompt", promptText)
        formData.append("conversationId", conversation?._id || "")
        formData.append("agent", "auto")

        dispatch(addMessage({ role: "user", content: promptText }))

        try {
            const data = await sendMessage(formData)
            dispatch(setIsLoading(false))
            if (data) {
                if (data.artifacts && data.artifacts.length > 0) {
                    dispatch(setArtifacts(data.artifacts))
                }
                dispatch(addMessage({ role: "assistant", content: data?.answer || "No response received.", images: data?.images || [] }))
            }
        } catch (err) {
            dispatch(setIsLoading(false))
            dispatch(addMessage({ role: "assistant", content: `Error: ${err.message}` }))
        }
    }

    const suggestions = ["Write a Netflix clone", "Explain Redis", "Build a dashboard", "Search latest tech news"]

    return (
        <div className='flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {messages.length === 0 || !selectedConversation ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className='text-[22px] font-semibold text-slate-200 tracking-tight'>CortexAI</h1>
                        <p className='text-[15px] font-medium text-slate-400 tracking-tight'>How can I help you today?</p>
                        <p className='text-[13px] text-slate-500 max-w-[320px] leading-relaxed'>
                            Ask me anything — code projects, internet search, PDF/PPT generation, or image analysis.
                        </p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 mt-2 max-w-[500px]'>
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='space-y-5'>
                    {messages.map((msg, index) => (
                        <div key={msg?._id || `msg-${index}`}>
                            <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} /> 
                        </div>
                    ))}
                    {isLoading && <LoadingAnimation />}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList
