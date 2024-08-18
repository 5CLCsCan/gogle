'use client'

import { Place as PlaceType, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { useEffect, useMemo, useState } from 'react'
import SelectPlaceComponent from '@/components/SelectPlace'
import dynamic from 'next/dynamic'
import { useCenterStore, useRadiusStore } from '@/store'

type EditTripPageProps = {
  params: {
    id: string
  }
}

export default function EditTripPage({ params }: EditTripPageProps) {
  const { id } = params
  const [trip, setTrip] = useState<Trip>({} as Trip)
  const [places, setPlaces] = useState<PlaceType[]>([])
  const center = useCenterStore(state => state.center)
  const radius = useRadiusStore(state => state.radius)
  useEffect(() => {
    const fetchTrip = async () => {
      const resp = await fetchData('GET', `trip/${id}`)
      if (resp.status !== 200) {
        console.error('Error fetching trip')
        return
      }
      const data = await resp.json()
      console.log(data)

      for (const place of data.places) {
        place.id = place._id
      }

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
    [center, radius, places],
  )

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-primary text-2xl mb-4'>
        Editing trip: {trip.tripName}
      </h1>
      <div className='flex w-2/3 h-[500px] gap-6'>
        <div className='flex flex-col gap-6 w-1/2 h-full overflow-auto'>
          {trip && (
            <SelectPlaceComponent
              selectedPlaces={places}
              setSelectedPlaces={setPlaces}
              tripInfo={trip}
            />
          )}
        </div>
        <div className='w-1/2'>
          <Map selectedPlaces={places} />
        </div>
      </div>
    </div>
  )
}
