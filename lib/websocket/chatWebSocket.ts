import { addMessage } from "../slices/chatSlice"

export class ChatWebSocket {
  private socket: WebSocket | null = null
  private dispatch: any
  private token: string

  constructor(dispatch: any, token: string) {
    this.dispatch = dispatch
    this.token = token
  }

  connect() {
    this.socket = new WebSocket(`ws://localhost:8050/ws?token=${this.token}`)

    this.socket.onopen = () => {
      console.log('WebSocket connected')
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('WebSocket message received:', message)
        
        this.dispatch(addMessage({
          roomUUID: message.room_uuid,
          message: {
            uuid: message.uuid || `ws-${Date.now()}`,
            user_id: message.sender,
            content: message.content,
            message_type: message.type,
            created_at: message.timestamp || new Date().toISOString()
          }
        }))
      } catch (error) {
        console.error('WebSocket message parse error:', error)
      }
    }

    this.socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  sendMessage(roomUUID: string, content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        room_uuid: roomUUID,
        content: content,
        type: 'text'
      }))
    }
  }
}