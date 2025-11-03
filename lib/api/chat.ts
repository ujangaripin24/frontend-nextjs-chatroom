export interface ChatRoom {
  uuid: string
  name: string
  description: string
  created_by: string
  created_at: string
}

export interface ChatMessage {
  uuid: string
  user_id: string
  content: string
  message_type: string
  created_at: string
}

export const chatAPI = {
  getRooms: async (token: string): Promise<ChatRoom[]> => {
    const response = await fetch('http://localhost:8050/chat/rooms', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch rooms')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  },
  getRoomMessages: async (token: string, roomUUID: string): Promise<ChatMessage[]> => {
    const response = await fetch(`http://localhost:8050/chat/rooms/${roomUUID}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    return response.json()
  },

  sendMessage: async (token: string, roomUUID: string, content: string) => {
    const response = await fetch(`http://localhost:8050/chat/rooms/${roomUUID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        message_type: 'text'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }
}