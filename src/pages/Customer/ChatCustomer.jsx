import { useEffect } from 'react'
import ChatWindow from '../../components/ChatWindow'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'

const ChatCustomer = () => {
  const { initializeConversation, activeConversationId } = useChat()
  const { user } = useAuth()

  useEffect(() => {
    // Initialize conversation when customer opens chat
    if (user && user.email) {
      initializeConversation(user.email, user.displayName || user.email.split('@')[0])
    }
  }, [user, initializeConversation])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Chat with Shop</h1>
        <p className="text-gray-600 dark:text-gray-400">Have questions? We're here to help!</p>
      </div>

      {/* Chat Window */}
      {activeConversationId ? (
        <ChatWindow isOwner={false} userName="Smart Meal Shop" currentConversationId={activeConversationId} />
      ) : (
        <div className="card h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Initializing chat...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatCustomer
