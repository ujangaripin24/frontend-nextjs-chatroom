'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchProfile, logout } from '@/lib/slices/authSlice'
import { authAPI } from '@/lib/api/auth'
import LogoutScreen from './LogoutScreen'

export default function ProfileScreen() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, token, isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login')
      return
    }

    if (!user && token) {
      dispatch(fetchProfile(token))
    }
  }, [isAuthenticated, token, user, dispatch, router])

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  {user.link_picture ? (
                    <img
                      src={user.link_picture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-600">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user.username}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Username</label>
                    <p className="mt-1 text-lg">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-lg">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                    <p className="mt-1 text-sm font-mono text-gray-600 break-all">{user.uuid}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Type</label>
                    <p className="mt-1 text-lg">Standard User</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <LogoutScreen/>
              </div>
            </div>
          ) : (
            <div>No user data available</div>
          )}
        </div>
      </div>
    </div>
  )
}