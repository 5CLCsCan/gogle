import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MapCenterType } from '@/types'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { fetchData } from '@/utils/fetchData'
import { CreatTripStepPageProps } from '@/types'
import { defaultCenter, useCenterStore, useRadiusStore } from '@/store'

const createTripFirstStepSchema = z.object({
  startLocation: z.string(),
  labels: z.array(z.string()),
  tripLength: z.number().int().positive().min(1).max(20),
  latitude: z.number(),
  longitude: z.number(),
})

const defaultAddress = '227 Nguyen Van Cu, District 5, Ho Chi Minh City'

export default function FirstStep({ setIndex }: CreatTripStepPageProps) {
  const center = useCenterStore(state => state.center)
  const setCenter = useCenterStore(state => state.setCenter)
  const setRadius = useRadiusStore(state => state.setRadius)
  const [address, setAddress] = useState(defaultAddress)
  const debouncedPosition = useDebounce(address, 500)
  const [tripData, setTripData] = useState<any>({})
  const { toast } = useToast()
  const router = useRouter()
  const createTripFirstStepForm = useForm({
    resolver: zodResolver(createTripFirstStepSchema),
    defaultValues: {
      startLocation: '',
      labels: [],
      tripLength: 4,
      latitude: center.lat,
      longitude: center.lng,
    },
  })

  const onSubmit = async (
    values: z.infer<typeof createTripFirstStepSchema>,
  ) => {
    values.latitude = center.lat
    values.longitude = center.lng
    console.log(values)
    console.log(tripData)

    const fullData = { ...values, ...tripData }
    const resp = await fetchData('POST', 'trip', 0, fullData)
    if (!resp.ok) {
      toast({
        title: 'Error while creating trip',
        description: 'Please try again',
      })
      return
    }
    const data = await resp.json()
    localStorage.setItem('trip', JSON.stringify(data))
    setIndex(1)
  }

  const setToCurrentLocation = () => {
    console.log('getting current location')
    navigator.geolocation.getCurrentPosition(
      async position => {
        console.log(position)
        const respone = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
        )

        if (!respone.ok) {
          console.log('Error while fetching location')
          return
        }
        const data = await respone.json()
        setAddress(data.display_name)

        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      error => {
        setCenter(defaultCenter)
        setAddress(defaultAddress)
        toast({
          title: 'Error while fetching location',
          description: error.message,
        })
        console.log(error)
      },
    )
  }

  useEffect(() => {
    console.log('debouncedPosition', debouncedPosition)
    if (debouncedPosition === '') {
      return
    }

    const updateLatLng = async () => {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${debouncedPosition}&format=json`,
      )
      if (!resp.ok) {
        console.log('Error while fetching location')
        return
      }

      const data = await resp.json()
      if (data.length > 0) {
        const { lat, lon } = data[0]
        setCenter({
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        })
      }
    }
    updateLatLng()
  }, [debouncedPosition])

  useEffect(() => {
    const currentTripData = localStorage.getItem('trip')
    if (currentTripData === null || currentTripData === '') {
      router.push('/create')
    }
    setTripData(JSON.parse(currentTripData!))
  }, [])

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='p-4 flex flex-col gap-10 justify-center'>
        <h1 className='text-primary text-3xl'>Explore your adventure</h1>
        <Form {...createTripFirstStepForm}>
          <form
            className='flex flex-col gap-14'
            onSubmit={createTripFirstStepForm.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-4 justify-center'>
              <FormField
                name='startLocation'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className='flex justify-between items-center'>
                        <FormLabel htmlFor='startLocation'>
                          Where&#39;s your starting point
                        </FormLabel>
                        <Button
                          onClick={() => {
                            setToCurrentLocation()
                          }}
                          type='button'
                          variant='ghost'
                        >
                          <MapPin />
                          Current location
                        </Button>
                      </div>
                      <Input
                        id='startLocation'
                        {...field}
                        className='pr-10'
                        placeholder='Enter your starting point'
                        onChange={e => {
                          setAddress(e.target.value)
                        }}
                        value={address}
                      />
                    </FormItem>
                  )
                }}
              />
              {/* <FormField
                  control={createTripFirstStepForm.control}
                  name='labels'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Your journey area</FormLabel>
                      <MultiSelector
                        onValuesChange={field.onChange}
                        values={field.value}
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder='Select places...' />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {districts.map(district => (
                              <MultiSelectorItem
                                key={district.value}
                                value={district.value}
                              >
                                <div className='flex items-center space-x-2'>
                                  <span>{district.label}</span>
                                </div>
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              <FormField
                control={createTripFirstStepForm.control}
                name='tripLength'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>Max length: {field.value} (km)</FormLabel>
                    <FormControl>
                      <Slider
                        onValueChange={values => {
                          // TODO: add debounce
                          const value = values[0]
                          field.onChange(value)
                          setRadius(value * 1000)
                        }}
                        defaultValue={[4]}
                        min={1}
                        max={20}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-between'>
              <Button
                type='button'
                onClick={() => {
                  router.push('/create')
                }}
              >
                Previous
              </Button>
              <Button type='submit'>Next</Button>
            </div>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  )
}