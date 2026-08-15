import { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setArtifacts, setMessages } from '../redux/messageSlice'

function ChatArea() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (selectedConversation && selectedConversation._id) {
        if (selectedConversation.title === "New Chat" && !selectedConversation.updatedAt) return
        const data = await getMessages(selectedConversation._id)
        if (Array.isArray(data)) {
          dispatch(setMessages(data))
          const latestArtifactMessage = [...data].reverse().find(msg => msg.artifacts && msg.artifacts.length > 0)
          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []))
        }
      } else {
        dispatch(setMessages([]))
        dispatch(setArtifacts([]))
      }
    }

    fetchChatMessages()
  }, [selectedConversation, dispatch])

  return (
    <div className='flex-1 flex flex-col min-w-0 bg-[#0d0f14] h-screen'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea
