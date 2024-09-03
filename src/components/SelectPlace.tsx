import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core'
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Place as PlaceType } from '@/types'
import MiniPlace from './MiniPlace'
import { Input } from './ui/input'
import Place from './Place'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchData } from '@/utils/fetchData'
import { useState, useEffect } from 'react'

type SelectPageComponentProps = {
  setSelectedPlaces: (places: PlaceType[]) => void
  selectedPlaces: PlaceType[]
  tripInfo: any
}

export default function SelectPageComponent({
  setSelectedPlaces,
  selectedPlaces,
  tripInfo,
}: SelectPageComponentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [displayPlaces, setDisplayPlaces] = useState<PlaceType[]>([])
  const [recommendations, setRecommendations] = useState<PlaceType[]>([])
  const [searchedPlaces, setSearchedPlaces] = useState<PlaceType[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const selectPlace = async (id: string) => {
    const selectedPlace = displayPlaces.find(place => place._id === id)
    console.log(selectedPlace)

    setSelectedPlaces!([...selectedPlaces!, selectedPlace!])
  }

  const fetchRecommendations = async (tripID: string) => {
    const selectedCategories = selectedPlaces!.map(place => place.category)
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
    if (tripInfo === null || tripInfo?._id === undefined) return
    fetchRecommendations(tripInfo._id)
  }, [tripInfo, selectedPlaces])

  const removePlace = (id: string) => {
    console.log(id)
    console.log(selectedPlaces)
    const newPlaces = selectedPlaces!.filter(place => place.id !== id)
    console.log(newPlaces)

    setSelectedPlaces!(newPlaces)
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
        if (place.priceRange) {
          if (place.priceRange[0] === -1) {
            place.priceRange = undefined as any
          }
        }
      })

      setSearchedPlaces(data)
      setDisplayPlaces(data)
    }
    fetchPlaces()
  }, [debouncedSearchQuery])

  return (
    <>
      <div className='flex gap-2'>
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedPlaces!}
            strategy={horizontalListSortingStrategy}
          >
            {selectedPlaces!.map((place, index) => {
              console.log(place)
              return (
                <div key={`mini-${place._id}`} className='relative'>
                  <MiniPlace
                    place={place}
                    removePlace={removePlace}
                    index={place._id}
                  />
                </div>
              )
            })}
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
    </>
  )
}
