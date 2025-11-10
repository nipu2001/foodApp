import { useState, useEffect, useRef } from 'react'
import { FiSend } from 'react-icons/fi'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'

const ChatWindow = ({ isOwner = false, userName = 'Customer', conversationId = null }) => {
  const { user } = useAuth()
  const { getMessages, sendMessage, markAsRead, activeConversationId } = useChat()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  
  const currentConversationId = conversationId || activeConversationId
  const messages = getMessages(currentConversationId)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark as read when conversation opens
  useEffect(() => {
    if (currentConversationId) {
      markAsRead(currentConversationId, isOwner)
    }
  }, [currentConversationId, isOwner])

  const handleSend = async () => {
    if (newMessage.trim() && currentConversationId) {
      const sender = isOwner ? 'owner' : 'customer'
      const senderName = isOwner ? 'Shop Owner' : user?.name || 'Customer'
      
      const result = await sendMessage(currentConversationId, newMessage.trim(), sender, senderName)
      
      if (result.success) {
        setNewMessage('')
      } else {
        alert('Failed to send message: ' + result.message)
      }
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{userName}</h3>
          <p className="text-sm text-green-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message) => {
              const isOwnMessage = isOwner
                ? message.sender === 'owner'
                : message.sender === 'customer'

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {!isOwnMessage && message.senderName && (
                      <p className="text-xs font-semibold mb-1 opacity-75">{message.senderName}</p>
                    )}
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp || message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation by sending a message!</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
        />
        <button onClick={handleSend} className="btn-primary">
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
