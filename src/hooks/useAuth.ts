'use client'

export const useAuth = () => {
  if (typeof window === 'undefined') return { accessToken: '', env: 'server' }
  return { accessToken: localStorage.getItem('accessToken'), env: 'client' }
}
