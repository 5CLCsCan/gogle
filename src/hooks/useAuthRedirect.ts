'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('accessToken')
}

const useAuthRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/')
    }
  }, [router])

  return isLoggedIn()
}

export default useAuthRedirect
