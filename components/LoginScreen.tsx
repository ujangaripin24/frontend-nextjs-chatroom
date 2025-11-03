'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { clearError, loginUser } from '@/lib/slices/authSlice'
import { Button } from 'flowbite-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaUser, FaEye, FaGoogle, FaFacebook, FaCheck } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isClient, setIsClient] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isClient, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser({ email, password }))

    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard')
    }
  }

  if (!isClient || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <section>
      <div className='flex'>
        <div className='w-screen hidden md:block p-6'>
          <div className='flex items-center h-screen'>
            <div>
              <div>
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                  <Image width={0} height={0} className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                  Flowbite
                </a>
              </div>
              <div className='text-4xl font-bold dark:text-white'>Selamat Datang Flowbite Chat</div>
              <div>
                <div>
                  <div><FaCheck />
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi, dolorum ipsam! Inventore dolorum facilis laboriosam!</p>
                  </div>
                </div>
                <div>
                  <div><FaCheck />
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non, perspiciatis.</p></div>
                </div>
                <div>
                  <div><FaCheck />
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo, quaerat.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex justify-center items-center h-screen'>
            <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div>
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                  <Image width={0} height={0} className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                  Flowbite
                </a>
              </div>
              <div className='mb-6'>
                <div className='text-3xl font-bold dark:text-white'>Selamat Datang Kembali</div>
                <div className='text-md dark:text-white'>Register sekarang <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-500">Disini</Link></div>
              </div>
              <div className='flex max-w-md flex-col gap-4' onSubmit={handleSubmit}>
                <form className="">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  <div className='flex flex-col gap-4'>
                    <div>
                      <label htmlFor="email-address-icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FaMessage className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (error) dispatch(clearError())
                          }}
                          type="email" id="email-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password-address-icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <div>
                            <FaEye className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                        <input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (error) dispatch(clearError())
                          }}
                          type="password" id="password-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="******" />
                      </div>
                    </div>
                    <div>
                      <Button className='w-full' disabled={loading} color={'light'} size="lg" type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
                    </div>
                  </div>
                </form>
                <hr />
                <div className='flex flex-row gap-4'>
                  <Button className='w-full' outline color={'blue'} size="lg" type="submit">
                    <FaGoogle />
                  </Button>
                  <Button className='w-full' outline color={'blue'} size="lg" type="submit">
                    <FaFacebook />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
