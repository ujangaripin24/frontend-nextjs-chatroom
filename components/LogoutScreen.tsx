'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout } from '@/lib/slices/authSlice'
import { authAPI } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export default function LogoutScreen() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { token } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    if (token) {
      try {
        await authAPI.logout(token)
      } catch (error) {
        console.log('Logout API failed, but clearing local state')
      }
    }
    dispatch(logout())
    router.push('/login')
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}