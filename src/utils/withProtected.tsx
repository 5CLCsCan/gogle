'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

export const withProtected = (WrappedComponent: React.FunctionComponent) => {
  return (props: any) => {
    const { accessToken, env } = useAuth()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
      if (accessToken === null) {
        redirect('/login')
      }
      setIsChecking(false)
    }, [accessToken])

    if (isChecking) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
