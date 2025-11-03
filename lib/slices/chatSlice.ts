import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatAPI, ChatRoom } from '../api/chat'

export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getRooms(token)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

interface ChatState {
  rooms: ChatRoom[]
  loading: boolean
  error: string | null
  currentRoom: string | null
}

const initialState: ChatState = {
  rooms: [],
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
  },
})

export const { setCurrentRoom, clearError, addRoom } = chatSlice.actions
export default chatSlice.reducer