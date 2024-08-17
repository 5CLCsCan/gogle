'use client'

import { Place, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { useEffect, useState } from 'react'

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

  return (
    <div>
      <h1>{trip.tripName}</h1>
      {places.map(place => (
        <div key={place.id}>
          <h2>{place.name}</h2>
          <p>{place.address}</p>
        </div>
      ))}
    </div>
  )
}
