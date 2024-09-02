import { Button } from '@/components/ui/button'
import { Place as PlaceType, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreatTripStepPageProps } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import SelectPlaceComponent from '@/components/SelectPlace'

export default function SecondStep({
  selectedPlaces,
  setSelectedPlaces,
}: CreatTripStepPageProps) {
  const [tripInfo, setTripInfo] = useState<Trip>(null as any)
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('trip') === null) {
      router.push('/create')
    }
    const trip = JSON.parse(localStorage.getItem('trip')!)
    console.log(trip.data)

    setTripInfo(trip.data)
  }, [])

  const updateTrip = async () => {
    const trip = JSON.parse(localStorage.getItem('trip')!)
    trip.data.places = selectedPlaces!.map(place => place._id)
    console.log(trip)
    console.log(selectedPlaces)

    for (const place of selectedPlaces!) {
      const body = {
        placeID: place._id,
        tripID: trip.data._id,
      }
      const resp = await fetchData('PUT', `places`, 0, body)
      const data = await resp.json()
      console.log(data)
    }

    localStorage.removeItem('trip')
    router.push('/home')
  }

  return (
    <>
      <div className='h-full p-2 flex flex-col gap-6 mb-4'>
        <h1 className='text-primary text-3xl'>Building your adventure</h1>
        <SelectPlaceComponent
          setSelectedPlaces={setSelectedPlaces!}
          selectedPlaces={selectedPlaces!}
          tripInfo={tripInfo}
        />
      </div>
      <Button className='self-end float-right' onClick={updateTrip}>
        Finish
      </Button>
    </>
  )
}
