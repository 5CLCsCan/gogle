import Map from '@/components/Map'
import Place from '@/components/Place'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Place as PlaceType, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { CreatTripStepPageProps } from '../[step]/page'
import {
  closestCorners,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import MiniPlace from '@/components/MiniPlace'

export default function SecondStep({
  selectedPlaces,
  setSelectedPlaces,
}: CreatTripStepPageProps) {
  const [recommendations, setRecommendations] = useState<PlaceType[]>([] as any)
  const [tripInfo, setTripInfo] = useState<Trip>(null as any)
  // const [selectedPlaces, setSelectedPlaces] = useState<PlaceType[]>([] as any)
  const router = useRouter()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const fetchRecommendations = async (tripID: string) => {
    const resp = await fetchData('GET', `places?tripID=${tripID}`)
    const data = await resp.json()
    console.log(data)

    data.forEach((place: PlaceType, index: number) => {
      place.id = place._id
    })
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
    setSelectedPlaces!([...selectedPlaces!, selectedPlace!])
  }

  const removePlace = (id: string) => {
    const newPlaces = selectedPlaces!.filter(place => place.id !== id)
    setSelectedPlaces!(newPlaces)
  }

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
      const resp = await fetchData('POST', `places`, 0, body)
      const data = await resp.json()
      console.log(data)
    }

    localStorage.removeItem('trip')
    router.push('/home')
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = selectedPlaces!.findIndex(
        place => place.id === active.id,
      )
      const newIndex = selectedPlaces!.findIndex(place => place.id === over.id)

      const newPlaces = [...selectedPlaces!]
      newPlaces.splice(oldIndex, 1)
      newPlaces.splice(newIndex, 0, selectedPlaces![oldIndex])

      setSelectedPlaces!(newPlaces)
    }
  }

  return (
    <>
      <div className='h-[inherit] overflow-auto p-2 flex flex-col gap-6 mb-4'>
        <h1 className='text-primary text-3xl'>Building your adventure</h1>
        <div className='flex gap-2'>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedPlaces!}
              strategy={horizontalListSortingStrategy}
            >
              {selectedPlaces!.map((place, index) => (
                <div key={`mini-${place.id}`} className='relative'>
                  <MiniPlace
                    place={place}
                    removePlace={removePlace}
                    index={place.id}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
          <Button className='rounded-full h-[60px] w-[60px]' variant='outline'>
            <Plus size={16} />
          </Button>
        </div>
        <Input placeholder='Search for a location' className='self-start' />
        <section className='grid grid-cols-2 gap-4'>
          {recommendations.map((place, index) =>
            selectedPlaces!.includes(place) ? (
              <Place
                key={index}
                variant='selected'
                onClick={() => removePlace(place.id)}
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
      <Button className='self-end float-right' onClick={updateTrip}>
        Finish
      </Button>
    </>
  )
}
