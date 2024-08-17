import Place from '@/components/Place'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Place as PlaceType, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreatTripStepPageProps } from '@/types'
import { closestCorners, DndContext } from '@dnd-kit/core'
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import MiniPlace from '@/components/MiniPlace'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from '@/components/ui/use-toast'

export default function SecondStep({
  selectedPlaces,
  setSelectedPlaces,
}: CreatTripStepPageProps) {
  const [recommendations, setRecommendations] = useState<PlaceType[]>([] as any)
  const [tripInfo, setTripInfo] = useState<Trip>(null as any)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [searchedPlaces, setSearchedPlaces] = useState<PlaceType[]>([] as any)
  const [displayPlaces, setDisplayPlaces] = useState<PlaceType[]>([] as any)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const router = useRouter()

  const fetchRecommendations = async (tripID: string) => {
    const resp = await fetchData('POST', `places?tripID=${tripID}`, 0, {
      tripID,
      categories: selectedCategories,
    })
    const data = await resp.json()
    console.log(data)

    data.forEach((place: PlaceType, index: number) => {
      place.id = place._id
    })
    setRecommendations(data)
    setDisplayPlaces(data)
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
  }, [tripInfo, selectedCategories])

  const selectPlace = async (id: string) => {
    const selectedPlace = displayPlaces.find(place => place._id === id)
    console.log(selectedPlace)

    setSelectedCategories([...selectedCategories, selectedPlace!.category])
    setSelectedPlaces!([...selectedPlaces!, selectedPlace!])
  }

  const removePlace = (id: string) => {
    const newPlaces = selectedPlaces!.filter(place => place.id !== id)
    const removedPlace = selectedPlaces!.find(place => place.id === id)

    setSelectedCategories(
      selectedCategories.filter(
        category => category !== removedPlace!.category,
      ),
    )
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

  useEffect(() => {
    if (debouncedSearchQuery === '') {
      setSearchedPlaces([])
      setDisplayPlaces(recommendations)
      return
    }

    const fetchPlaces = async () => {
      const resp = await fetchData(
        'GET',
        `search?query=${debouncedSearchQuery}`,
      )
      const data = await resp.json()
      console.log(data)
      data.forEach((place: PlaceType, index: number) => {
        place.id = place._id
      })

      setSearchedPlaces(data)
      setDisplayPlaces(data)
    }
    fetchPlaces()
  }, [debouncedSearchQuery])

  return (
    <>
      <div className='h-full p-2 flex flex-col gap-6 mb-4'>
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
                <div key={`mini-${place._id}`} className='relative'>
                  <MiniPlace
                    place={place}
                    removePlace={removePlace}
                    index={place._id}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
          <Button className='rounded-full h-[60px] w-[60px]' variant='outline'>
            <Plus size={16} />
          </Button>
        </div>
        <Input
          placeholder='Search for a location'
          className='self-start'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <section className='grid grid-cols-2 gap-4 overflow-auto'>
          {displayPlaces.map((place, index) =>
            selectedPlaces!.some(p => p._id === place._id) ? (
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
      <Button className='self-end float-right' onClick={updateTrip}>
        Finish
      </Button>
    </>
  )
}
