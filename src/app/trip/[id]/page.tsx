'use client'

import { Place, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { cn, formatter } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type TripDetailsPageProps = {
  params: {
    id: string
  }
}

export default function TripDetails({ params }: TripDetailsPageProps) {
  const [trip, setTrip] = useState<Trip>({} as Trip)
  const [places, setPlaces] = useState<Place[]>([])
  const { id } = params

  useEffect(() => {
    const fetchTrip = async () => {
      const resp = await fetchData('GET', `trip/${id}`)
      if (resp.status !== 200) {
        console.error('Error fetching trip')
        return
      }
      const data = await resp.json()
      console.log(data)

      setTrip(data.trip)
      setPlaces(data.places)
    }
    fetchTrip()
  }, [])

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  )

  return (
    <section className='flex flex-col items-center'>
      <div className='flex w-3/4 items-center mb-5'>
        <h1 className='text-primary text-3xl ml-auto'>Trip: {trip.tripName}</h1>
        <Button className='float-right ml-auto' variant='link'>
          <Link href={`edit/${trip._id}`}>Edit</Link>
        </Button>
      </div>
      <div className='flex gap-4 h-[500px] w-3/4'>
        <div className='w-1/2 flex flex-col gap-4'>
          {places.map((place, index) => (
            <div
              className={cn(
                'flex justify-between items-center',
                index % 2 === 1 ? 'flex-row-reverse text-right' : '',
              )}
            >
              <div key={place.id}>
                <h3 className='font-semibold text-xl'>{place.name}</h3>
                <p className='italic text-black/40 text-sm'>{place.address}</p>
                <p>
                  {place.priceRange
                    ? `${formatter.format(
                        place.priceRange[0],
                      )} - ${formatter.format(place.priceRange[1])}`
                    : 'VND 50,000 - VND 100,000'}
                </p>
              </div>
              <Image
                src={place.imgLink}
                alt={place.name}
                height={80}
                width={80}
                className='rounded-full h-20'
              />
            </div>
          ))}
        </div>
        <div className='w-1/2'>
          <Map selectedPlaces={places} />
        </div>
      </div>
    </section>
  )
}
