import Map from '@/components/Map'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/magicui/multi-select'
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

const districts = [
  {
    label: 'District 1',
    value: 'District 1',
  },
  {
    label: 'District 2',
    value: 'District 2',
  },
  {
    label: 'District 3',
    value: 'District 3',
  },
  {
    label: 'District 4',
    value: 'District 4',
  },
  {
    label: 'District 5',
    value: 'District 5',
  },
  {
    label: 'District 6',
    value: 'District 6',
  },
  {
    label: 'District 7',
    value: 'District 7',
  },
  {
    label: 'District 8',
    value: 'District 8',
  },
  {
    label: 'District 9',
    value: 'District 9',
  },
  {
    label: 'District 10',
    value: 'District 10',
  },
  {
    label: 'District 11',
    value: 'District 11',
  },
  {
    label: 'District 12',
    value: 'District 12',
  },
  {
    label: 'Binh Tan',
    value: 'Binh Tan',
  },
  {
    label: 'Binh Thanh',
    value: 'Binh Thanh',
  },
  {
    label: 'Go Vap',
    value: 'Go Vap',
  },
  {
    label: 'Phu Nhuan',
    value: 'Phu Nhuan',
  },
  {
    label: 'Tan Binh',
    value: 'Tan Binh',
  },
  {
    label: 'Tan Phu',
    value: 'Tan Phu',
  },
  {
    label: 'Thu Duc',
    value: 'Thu Duc',
  },
]

const createTripFirstStepSchema = z.object({
  startLocation: z.string(),
  labels: z.array(z.string()),
  tripLength: z.number().int().positive().min(1).max(20),
  latitude: z.number(),
  longitude: z.number(),
})

const defaultLocation: MapCenterType = {
  lat: 10.762328,
  lng: 106.6827293,
}

const defaultAddress = '227 Nguyen Van Cu, District 5, Ho Chi Minh City'

export default function FirstStep() {
  const [location, setLocation] = useState(defaultAddress)
  const debouncedPosition = useDebounce(location, 500)
  const [center, setCenter] = useState<MapCenterType>(defaultLocation)
  const [radius, setRadius] = useState<number>(4000)
  const [tripData, setTripData] = useState<any>({})
  const { toast } = useToast()
  const router = useRouter()
  const createTripFirstStepForm = useForm({
    resolver: zodResolver(createTripFirstStepSchema),
    defaultValues: {
      startLocation: '',
      labels: [],
      tripLength: 4,
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lng,
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
    router.push('/create/2')
  }

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [center, radius],
  )

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
        setLocation(data.display_name)

        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      error => {
        setCenter(defaultLocation)
        setLocation(defaultAddress)
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
      <div className='flex w-2/3'>
        <div className='w-[40%] p-4 flex flex-col gap-10 justify-center'>
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
                            setLocation(e.target.value)
                          }}
                          value={location}
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
        <div className='w-[60%] h-[500px]'>
          <Map center={center} radius={radius} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
