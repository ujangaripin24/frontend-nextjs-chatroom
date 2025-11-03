'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout } from '@/lib/slices/authSlice'
import { authAPI } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export default function LogoutScreen() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, token } = useAppSelector((state) => state.auth)

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
    <button disabled={loading} type="button" className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleLogout}>
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}