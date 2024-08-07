import Map from '@/components/Map'
import Place from '@/components/Place'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Place as PlaceType, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function SecondStep() {
  const [recommendations, setRecommendations] = useState<PlaceType[]>([] as any)
  const [tripInfo, setTripInfo] = useState<Trip>(null as any)
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceType[]>([] as any)
  const router = useRouter()

  const fetchRecommendations = async (tripID: string) => {
    const resp = await fetchData('GET', `places?tripID=${tripID}`)
    const data = await resp.json()
    console.log(data)

    setRecommendations(data)
  }

  useEffect(() => {
    if (localStorage.getItem('trip') === null) {
      router.push('/create')
    }
    const trip = JSON.parse(localStorage.getItem('trip')!)
    console.log(trip.data)

    setTripInfo(trip.data)
  }, [])

  useEffect(() => {
    if (tripInfo === null) return
    fetchRecommendations(tripInfo._id)
  }, [tripInfo])

  const selectPlace = (id: string) => {
    const selectedPlace = recommendations.find(place => place._id === id)
    console.log(selectedPlace)
    setSelectedPlaces([...selectedPlaces, selectedPlace!])
  }

  const removePlace = (id: string) => {
    const newPlaces = selectedPlaces.filter(place => place._id !== id)
    setSelectedPlaces(newPlaces)
  }

  const updateTrip = async () => {
    const trip = JSON.parse(localStorage.getItem('trip')!)
    trip.data.places = selectedPlaces.map(place => place._id)
    console.log(trip)

    selectedPlaces.forEach(async place => {
      const body = {
        placeID: place._id,
        tripID: trip.data._id,
      }
      const resp = await fetchData('POST', `places`, 0, body)
      const data = await resp.json()
      console.log(data)
    })

    localStorage.removeItem('trip')
    router.push('/home')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex w-full items-center justify-center'>
        <div className='w-2/3 flex gap-12'>
          <div className='w-[40%] h-[500px] overflow-auto p-2 flex flex-col gap-6'>
            <h1 className='text-primary text-3xl'>Building your adventure</h1>
            <div className='flex gap-2'>
              {selectedPlaces.map((place, index) => (
                <div key={index} className='relative'>
                  <img
                    key={index}
                    src={place.imgLink}
                    alt='Placeholder'
                    className='h-[60px] w-[60px] rounded-full'
                  />
                  <Button
                    className='absolute top-0 right-0 h-[20px] w-[20px] rounded-full px-0'
                    variant='destructive'
                    onClick={() => removePlace(place._id)}
                  >
                    <Minus size={10} />
                  </Button>
                </div>
              ))}
              <Button
                className='rounded-full h-[60px] w-[60px]'
                variant='outline'
              >
                <Plus size={16} />
              </Button>
            </div>
            <Input placeholder='Search for a location' className='self-start' />
            <section className='grid grid-cols-2 gap-4'>
              {recommendations.map((place, index) =>
                selectedPlaces.includes(place) ? (
                  <Place
                    key={index}
                    variant='selected'
                    onClick={() => removePlace(place._id)}
                    {...place}
                  />
                ) : (
                  <Place
                    key={index}
                    variant='default'
                    onClick={() => selectPlace(place._id)}
                    {...place}
                  />
                ),
              )}
            </section>
          </div>
          <div className='w-[60%] h-[500px]'>
            {tripInfo ? (
              <Map
                center={{
                  lat: tripInfo.userFilter.latitude,
                  lng: tripInfo.userFilter.longitude,
                }}
                radius={tripInfo.userFilter.maxDistance * 1000}
              />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <div className='w-2/3 flex flex-col'>
        <Button className='self-end' onClick={updateTrip}>
          Finish
        </Button>
      </div>
    </div>
  )
}
