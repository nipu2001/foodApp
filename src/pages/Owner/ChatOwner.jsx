import React, { useState } from 'react'
import ChatWindow from '../../components/ChatWindow'
import { useChat } from '../../contexts/ChatContext'

const ChatOwner = () => {
  const { conversations, getOwnerUnreadCount, activeConversationId, initializeConversation } = useChat()
  const [selectedConversation, setSelectedConversation] = useState(null)

  // Select first conversation by default or when conversations change
  React.useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0])
      initializeConversation(conversations[0].customerEmail, conversations[0].customerName)
    }
  }, [conversations, selectedConversation, initializeConversation])

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    initializeConversation(conversation.customerEmail, conversation.customerName)
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ''
    
    const now = new Date()
    const messageTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const diffInSeconds = Math.floor((now - messageTime) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Customer Chat</h1>
        <p className="text-gray-600 dark:text-gray-400">Communicate with your customers in real-time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <div className="card h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Customers {getOwnerUnreadCount() > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                  {getOwnerUnreadCount()}
                </span>
              )}
            </h2>
            
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{conversation.customerName}</span>
                      {conversation.unreadOwner > 0 && (
                        <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadOwner}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${
                      selectedConversation?.id === conversation.id 
                        ? 'text-primary-100' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedConversation?.id === conversation.id 
                        ? 'text-primary-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTimeAgo(conversation.lastMessageTime)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">No conversations yet</p>
                  <p className="text-sm">Conversations will appear here when customers message you</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedConversation && activeConversationId ? (
            <ChatWindow 
              isOwner={true} 
              userName={selectedConversation.customerName} 
              currentConversationId={activeConversationId}
            />
          ) : (
            <div className="card h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatOwner
