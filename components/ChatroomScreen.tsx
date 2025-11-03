'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addMessage, fetchRoomMessages, sendNewMessage } from '@/lib/slices/chatSlice'
import { fetchProfile } from '@/lib/slices/authSlice'
import { ChatWebSocket } from '@/lib/websocket/chatWebSocket'

export default function ChatRoomScreen() {
  const params = useParams()
  const roomUUID = params.uuid as string
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((state) => state.auth)
  const { messages, loading } = useAppSelector((state) => state.chat)
  const [newMessage, setNewMessage] = useState('')
  const [ws, setWs] = useState<ChatWebSocket | null>(null)
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentMessages = messages[roomUUID] || []

  // SINGLE WebSocket useEffect
  // components/ChatRoomScreen.tsx - WebSocket useEffect
  useEffect(() => {
    let chatWs: ChatWebSocket | null = null
    let isMounted = true

    const connectWebSocket = async () => {
      if (!token || !roomUUID) {
        console.log('❌ Missing token or roomUUID for WebSocket')
        return
      }

      try {
        setWsStatus('connecting')
        console.log('🔄 Starting WebSocket connection...')

        chatWs = new ChatWebSocket(dispatch, token)
        console.log('🔑 Token being used:', token.substring(0, 20) + '...')

        await chatWs.connect()

        if (isMounted) {
          setWs(chatWs)
          setWsStatus('connected')
          console.log('✅ WebSocket connected and ready')
        }

      } catch (error: any) {
        if (isMounted) {
          console.error('❌ WebSocket connection failed:', error.message)
          setWsStatus('error')
          setWs(null) // Ensure ws is null on error

          // Fallback: Use HTTP polling instead
          console.log('🔄 Falling back to HTTP mode')
        }
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false
      console.log('🧹 Cleaning up WebSocket')
      if (chatWs) {
        chatWs.disconnect()
      }
    }
  }, [token, roomUUID, dispatch])

  // Fetch messages ketika room berubah
  useEffect(() => {
    if (roomUUID && token) {
      console.log('📥 Fetching room messages...')
      dispatch(fetchRoomMessages({ token, roomUUID }))
    }
  }, [roomUUID, token, dispatch])

  // Auto-scroll ke message terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  // Fetch user profile jika belum ada
  useEffect(() => {
    if (token && !user) {
      console.log('👤 Fetching user profile...')
      dispatch(fetchProfile(token))
    }
  }, [token, user, dispatch])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi lengkap
    if (!newMessage.trim() || !roomUUID || !token || !user?.uuid) {
      console.error('Missing required data for sending message')
      return
    }

    // Check WebSocket connection
    if (!ws || !ws.isConnected()) {
      console.warn('WebSocket not connected, falling back to HTTP')
      // Fallback ke HTTP
      await dispatch(sendNewMessage({
        token,
        roomUUID,
        content: newMessage
      }))
      setNewMessage('')
      return
    }

    // Optimistic UI
    const tempMessage = {
      uuid: `temp-${Date.now()}`,
      user_id: user.uuid,
      content: newMessage,
      message_type: 'text',
      created_at: new Date().toISOString()
    }

    dispatch(addMessage({
      roomUUID,
      message: tempMessage
    }))

    setNewMessage('')

    // Kirim via WebSocket
    const success = ws.sendMessage(roomUUID, newMessage)
    if (!success) {
      console.error('Failed to send via WebSocket, message might not be delivered')
    }
  }

  const getCurrentUserUUID = () => {
    if (!user?.uuid) {
      console.warn('User UUID is not available')
      return null
    }
    return user.uuid
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Just now'
    }
  }

  // Debug logs
  console.log('=== CHAT ROOM DEBUG ===')
  console.log('User UUID:', user?.uuid)
  console.log('WebSocket Status:', wsStatus)
  console.log('WebSocket Instance:', ws)
  console.log('Messages count:', currentMessages.length)

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      {/* Header dengan WebSocket status */}
      <div className="border-b p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat Room</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${wsStatus === 'connected' ? 'bg-green-500' :
                wsStatus === 'connecting' ? 'bg-yellow-500' :
                  wsStatus === 'error' ? 'bg-red-500' :
                    'bg-gray-400'
              }`}></div>
            <span className="text-xs text-gray-500 capitalize">
              {wsStatus}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 truncate">User: {user?.uuid}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : currentMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          currentMessages.map((message) => {
            const currentUserUUID = getCurrentUserUUID()
            const messageUserID = message.user_id
            const isOwnMessage = currentUserUUID && messageUserID && currentUserUUID === messageUserID

            return (
              <div
                key={message.uuid || `msg-${message.created_at}-${Math.random()}`}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${isOwnMessage
                        ? 'text-blue-200'
                        : 'text-gray-500'
                      }`}
                  >
                    {formatTime(message.created_at)}
                    {isOwnMessage && ' (You)'}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={wsStatus === 'connecting'}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || wsStatus === 'connecting'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {wsStatus === 'connecting' ? 'Connecting...' : 'Send'}
          </button>
        </div>
        {wsStatus === 'error' && (
          <p className="text-xs text-red-500 mt-2">
            Connection issue - messages may not be delivered in real-time
          </p>
        )}
      </form>
    </div>
  )
}