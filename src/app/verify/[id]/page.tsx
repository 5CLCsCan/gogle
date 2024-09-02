'use client'

import { fetchData } from '@/utils/fetchData'
import { useEffect, useState } from 'react'

type VerifyPageProps = {
  params: {
    id: string
  }
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const [loading, setIsLoading] = useState(true)
  const { id } = params

  useEffect(() => {
    const verify = async () => {
      const data = await fetchData('GET', `verify?token=${id}`)
      if (data.status === 200) {
        setIsLoading(false)
      }
    }
    verify()
  }, [id])

  return (
    <div className='min-h-screen'>
      <h1 className='text-primary text-center text-3xl'>
        {loading ? 'Loading...' : 'Verified, please login'}
      </h1>
    </div>
  )
}
