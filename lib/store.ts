import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'

const getPreloadedState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    return {
      auth: {
        user: null,
        token: token,
        isAuthenticated: !!token,
        loading: false,
        error: null,
      }
    }
  }
  return {
    auth: {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer
  },
  preloadedState: getPreloadedState(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch