import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatAPI, ChatMessage, ChatRoom } from '../api/chat'

export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getRooms(token)
      return response || []
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRoomMessages = createAsyncThunk(
  'chat/fetchRoomMessages',
  async ({ token, roomUUID }: { token: string; roomUUID: string }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getRoomMessages(token, roomUUID)
      return { roomUUID, messages: response }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendNewMessage = createAsyncThunk(
  'chat/sendNewMessage',
  async ({ token, roomUUID, content }: { token: string; roomUUID: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(token, roomUUID, content)
      return { roomUUID, message: response }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

interface ChatState {
  rooms: ChatRoom[]
  messages: { [roomUUID: string]: ChatMessage[] }
  loading: boolean
  error: string | null
  currentRoom: string | null
}

const initialState: ChatState = {
  rooms: [],
  messages: {},
  loading: false,
  error: null,
  currentRoom: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    addRoom: (state, action) => {
      state.rooms.unshift(action.payload)
    },
    addMessage: (state, action) => {
      const { roomUUID, message } = action.payload
      if (state.messages[roomUUID]) {
        state.messages[roomUUID].push(message)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = action.payload
        state.error = null
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.loading = false
        const { roomUUID, messages } = action.payload
        state.messages[roomUUID] = messages
        state.error = null
      })
      .addCase(fetchRoomMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        const { roomUUID, message } = action.payload
        if (state.messages[roomUUID]) {
          state.messages[roomUUID].push(message)
        }
      })
  },
})

export const { setCurrentRoom, clearError, addRoom, addMessage } = chatSlice.actions
export default chatSlice.reducer