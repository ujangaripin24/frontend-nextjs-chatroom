import { addMessage } from "../slices/chatSlice"

export class ChatWebSocket {
  private socket: WebSocket | null = null
  private dispatch: any
  private token: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3

  constructor(dispatch: any, token: string) {
    this.dispatch = dispatch
    this.token = token
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://localhost:8050/ws?token=${this.token}`
        console.log('🔄 Connecting to WebSocket:', wsUrl)
        
        this.socket = new WebSocket(wsUrl)

        const connectionTimeout = setTimeout(() => {
          reject(new Error('Connection timeout'))
        }, 5000)

        this.socket.onopen = () => {
          clearTimeout(connectionTimeout)
          console.log('✅ WebSocket CONNECTED')
          this.reconnectAttempts = 0
          resolve(true)
        }

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('📨 WebSocket message received:', message)
            
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
            console.error('❌ WebSocket message parse error:', error)
          }
        }

        this.socket.onclose = (event) => {
          clearTimeout(connectionTimeout)
          console.log('🔌 WebSocket disconnected:', event.code, event.reason)
        }

        this.socket.onerror = (error) => {
          clearTimeout(connectionTimeout)
          console.error('❌ WebSocket connection error:', error)
          reject(error)
        }

      } catch (error) {
        console.error('💥 WebSocket setup error:', error)
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      console.log('🛑 Disconnecting WebSocket')
      this.socket.close(1000, 'Manual disconnect')
      this.socket = null
    }
  }

  sendMessage(roomUUID: string, content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        room_uuid: roomUUID,
        content: content,
        type: 'text'
      }
      console.log('📤 Sending WebSocket message:', message)
      this.socket.send(JSON.stringify(message))
      return true
    } else {
      console.error('🚫 WebSocket not connected. State:', this.socket?.readyState)
      return false
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}