'use client'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { withProtected } from '@/utils/withProtected'
import { Trash2Icon } from 'lucide-react'
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

  const deleteTrip = async (trip: Trip) => {
    try {
      const response = await fetchData('DELETE', 'trip', 0, {
        tripID: trip._id,
      })
      const data = await response.json()
      if (!response.ok) {
        toast({
          title: 'Error when deleting trip',
          description: data.message,
        })
        return
      }
      toast({
        title: 'Trip deleted',
        description: `Trip ${trip._id} has been deleted`,
      })
      setTrips(trips.filter(t => t._id !== trip._id))
    } catch (error) {
      console.error(error)
    }
  }

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
                <h4 className='text-2xl'>{trip.tripName}</h4>
              </Link>
              <p>
                Created at:{' '}
                {new Date(trip.userFilter.date).toLocaleDateString()}
              </p>
              <Button
                variant='destructive'
                className='float-right'
                onClick={() => {
                  deleteTrip(trip)
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
      </section>
      <Toaster />
    </main>
  )
}

export default withProtected(HomePage)
