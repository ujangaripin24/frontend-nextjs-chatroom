import { addMessage } from "../slices/chatSlice"

// lib/websocket/chatWebSocket.ts
export class ChatWebSocket {
  private socket: WebSocket | null = null
  private dispatch: any
  private token: string

  constructor(dispatch: any, token: string) {
    this.dispatch = dispatch
    this.token = token
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Validate token first
      if (!this.token || this.token.length < 10) {
        reject(new Error('Invalid token provided'))
        return
      }

      const wsUrl = `ws://localhost:8050/ws?token=${this.token}`
      console.log('🔄 WebSocket connecting to:', wsUrl)

      try {
        this.socket = new WebSocket(wsUrl)

        // Connection timeout
        const timeout = setTimeout(() => {
          if (this.socket?.readyState === WebSocket.CONNECTING) {
            this.socket.close()
            reject(new Error('Connection timeout after 5 seconds'))
          }
        }, 5000)

        this.socket.onopen = () => {
          clearTimeout(timeout)
          console.log('✅ WebSocket CONNECTED successfully')
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
          clearTimeout(timeout)
          console.log('🔌 WebSocket CLOSED:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          })
          
          if (event.code !== 1000) {
            reject(new Error(`WebSocket closed with code: ${event.code}`))
          }
        }

        this.socket.onerror = (event) => {
          clearTimeout(timeout)
          console.error('❌ WebSocket ERROR event details:', {
            eventType: event.type,
            socketReadyState: this.socket?.readyState,
            url: wsUrl
          })
          
          const error = event instanceof ErrorEvent ? event.error : 'Unknown WebSocket error'
          reject(new Error(`WebSocket error: ${error}`))
        }

      } catch (error) {
        console.error('💥 WebSocket constructor error:', error)
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      console.log('🛑 WebSocket disconnecting...')
      this.socket.close(1000, 'Manual disconnect')
      this.socket = null
    }
  }

  sendMessage(roomUUID: string, content: string): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        room_uuid: roomUUID,
        content: content,
        type: 'text'
      }
      console.log('📤 WebSocket sending message:', message)
      this.socket.send(JSON.stringify(message))
      return true
    } else {
      console.warn('🚫 WebSocket not ready. State:', this.getStatus())
      return false
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
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