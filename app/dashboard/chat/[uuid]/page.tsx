'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchRoomMessages, sendNewMessage } from '@/lib/slices/chatSlice'

export default function ChatRoomPage() {
  const params = useParams()
  const roomUUID = params.uuid as string
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((state) => state.auth)
  const { messages, loading } = useAppSelector((state) => state.chat)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentMessages = messages[roomUUID] || []

  useEffect(() => {
    if (roomUUID && token) {
      dispatch(fetchRoomMessages({ token, roomUUID }))
    }
  }, [roomUUID, token, dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !roomUUID || !token) return

    await dispatch(sendNewMessage({ 
      token, 
      roomUUID, 
      content: newMessage 
    }))
    setNewMessage('')
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      <div className="border-b p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <p className="text-sm text-gray-500">Room ID: {roomUUID}</p>
      </div>

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
          currentMessages.map((message) => (
            <div
              key={message.uuid}
              className={`flex ${
                message.user_id === user?.uuid ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user_id === user?.uuid
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.user_id === user?.uuid
                      ? 'text-blue-200'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}