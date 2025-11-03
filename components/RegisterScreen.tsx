'use client'

import Image from 'next/image'
import React from 'react'
import BackgroundImage from '@/assets/login-screen-image.jpg'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'
import Link from 'next/link'
import { FaEye, FaFacebook, FaGoogle, FaUser, FaVoicemail } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'

export default function RegisterScreen() {

  const handleShowPassword = () => {
    console.log("Masuk");
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
                <ul>
                  <li>1</li>
                  <li>2</li>
                </ul>
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
                <div className='text-md dark:text-white'>Login sekarang <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-500">Disini</Link></div>
              </div>
              <div className='flex max-w-md flex-col gap-4'>
                <form className="">
                  <div className='flex flex-col gap-4'>
                    <div>
                      <label htmlFor="user-address-icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FaUser className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </div>
                        <input type="" id="user-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john doe" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email-address-icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FaMessage className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </div>
                        <input type="email" id="email-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password-address-icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <button onClick={() => handleShowPassword()}>
                            <FaEye className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                          </button>
                        </div>
                        <input type="password" id="password-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="******" />
                      </div>
                    </div>
                    <div>
                      <Button className='w-full' color={'light'} size="lg" type="submit">Submit</Button>
                    </div>
                  </div>
                </form>
                <hr />
                <div className='flex flex-col gap-4'>
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
