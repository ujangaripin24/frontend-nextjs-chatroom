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
    try {
      const wsUrl = `ws://localhost:8050/ws?token=${this.token}`
      console.log('🔄 Connecting to WebSocket:', wsUrl)
      
      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log('✅ WebSocket connected successfully')
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
        console.log('🔌 WebSocket disconnected:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        })
      }

      this.socket.onerror = (event) => {
        console.error('❌ WebSocket error details:', {
          event: event,
          readyState: this.socket?.readyState,
          url: wsUrl
        })
        
        if (this.socket) {
          console.error('Socket states:', {
            readyState: this.socket.readyState,
            CONNECTING: WebSocket.CONNECTING,
            OPEN: WebSocket.OPEN,
            CLOSING: WebSocket.CLOSING,
            CLOSED: WebSocket.CLOSED
          })
        }
      }
    } catch (error) {
      console.error('💥 WebSocket connection failed:', error)
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🛑 Disconnecting WebSocket')
      this.socket.close()
      this.socket = null
    }
  }

  sendMessage(roomUUID: string, content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('📤 Sending WebSocket message:', { roomUUID, content })
      this.socket.send(JSON.stringify({
        room_uuid: roomUUID,
        content: content,
        type: 'text'
      }))
    } else {
      console.error('🚫 WebSocket not ready. State:', this.socket?.readyState)
    }
  }

  getStatus(): string {
    if (!this.socket) return 'DISCONNECTED'
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING'
      case WebSocket.OPEN: return 'CONNECTED'
      case WebSocket.CLOSING: return 'CLOSING'
      case WebSocket.CLOSED: return 'CLOSED'
      default: return 'UNKNOWN'
    }
  }
}