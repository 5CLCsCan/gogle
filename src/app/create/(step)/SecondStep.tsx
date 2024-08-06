import Map from '@/components/Map'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Place, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function SecondStep() {
  const [recommendations, setRecommendations] = useState<Place[]>([] as any)
  const [tripInfo, setTripInfo] = useState<Trip>(null as any)
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

  return (
    <div className='flex items-center justify-center'>
      <div className='w-2/3 flex gap-12'>
        <div className='w-[40%] h-[500px] overflow-auto p-2 flex flex-col gap-6'>
          <h1 className='text-primary text-3xl'>Building your adventure</h1>
          <div className='flex gap-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <img
                key={index}
                src='https://placeholder.co/60'
                alt='Placeholder'
                className='h-[60px] w-[60px] rounded-full'
              />
            ))}
            <Button
              className='rounded-full h-[60px] w-[60px]'
              variant='outline'
            >
              <Plus size={16} />
            </Button>
          </div>
          <Input placeholder='Search for a location' className='self-start' />
          <section className='grid grid-cols-3 gap-4'>
            {recommendations.map((place, index) => (
              <img
                className='rounded-lg'
                src={place.imgLink}
                alt='Placeholder'
                key={index}
              />
            ))}
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
  )
}
