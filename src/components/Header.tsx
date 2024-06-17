'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function Header() {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [accessToken])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.href = '/'
  }

  return (
    <header className='flex justify-between px-24 py-8'>
      <img src='/logo.svg' alt='logo' />
      {isLoading ? (
        <></>
      ) : (
        <div className='flex gap-2'>
          {accessToken ? (
            <>
              <Button className='bg-transparent text-md hover:bg-transparent rounded-full text-primary hover:opacity-80'>
                <Link href={'/home'}>Home</Link>
              </Button>
              <Button
                onClick={handleLogout}
                className='bg-transparent text-md hover:bg-transparent rounded-full text-primary hover:opacity-80'
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button className='bg-transparent text-md hover:bg-transparent rounded-full text-primary hover:opacity-80'>
                <Link href={'/login'}>Login</Link>
              </Button>
              <Button className='bg-[#0077B6] text-md rounded-full'>
                <Link href={'/signup'}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
