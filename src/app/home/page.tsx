'use client'

import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { withProtected } from '@/utils/withProtected'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetchData('GET', 'trip')
        const data = await response.json()
        if (!response.ok) {
          toast({
            title: 'Error when fetching trips',
            description: data.message,
          })
          return
        }
        console.log(data)
        setTrips(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTrips()
  }, [])

  return (
    <main className='flex flex-col px-24'>
      <h1 className='text-primary text-4xl text-center mb-10'>
        Welcome to Gogle!
      </h1>
      <section>
        <h3 className='text-left text-2xl font-medium'>Your trips</h3>
        <div className='grid grid-cols-3 gap-4'>
          {trips.map(trip => (
            <div
              key={trip._id}
              className='border border-gray-400 px-4 py-8 rounded-lg shadow-md'
            >
              <Link href={`/trip/${trip._id}`}>
                <h4 className='text-2xl'>{trip._id}</h4>
              </Link>
              <p>{trip.userFilter.date}</p>
            </div>
          ))}
        </div>
      </section>
      <Toaster />
    </main>
  )
}

export default withProtected(HomePage)
