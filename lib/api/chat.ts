export interface ChatRoom {
  uuid: string
  name: string
  description: string
  created_by: string
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
    
    return response.json()
  }
}