'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  ArrowRight,
  CalendarIcon,
  LoaderCircle,
  Martini,
  Sandwich,
  Store,
  TentTree,
  Utensils,
} from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { fetchData } from '@/utils/fetchData'
import { motion } from 'framer-motion'
import FirstStep from './(step)/FirstStep'
import SecondStep from './(step)/SecondStep'
import { Place } from '@/types'
import dynamic from 'next/dynamic'
import { useCenterStore, useRadiusStore } from '@/store'
import { CreatTripStepPageProps } from '@/types'

const createTripSchema = z.object({
  tripName: z.string().min(1),
  startDate: z.date(),
  numberOfPeople: z.coerce.number().int().positive().min(1).max(5),
  startTime: z.string(),
  budget: z.string(),
  favouriteCategories: z.string().array(),
})

const ITEM_PER_ROW = 3
type Icon = {
  [key: string]: JSX.Element
}
const icon: Icon = {
  feast: <Utensils />,
  snack: <Sandwich />,
  drink: <Martini />,
  outdoor: <TentTree />,
  indoor: <Store />,
}

const Steps = [
  (props: CreatTripStepPageProps) => <FirstStep {...props} />,
  (props: CreatTripStepPageProps) => <SecondStep {...props} />,
]

export default function CreateTripPage() {
  const [activities, setActivities] = useState<string[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tripName, setTripName] = useState('')
  const [index, setIndex] = useState(-1)
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])
  const center = useCenterStore(state => state.center)
  const radius = useRadiusStore(state => state.radius)
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [center, radius, selectedPlaces],
  )
  const createTripForm = useForm({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      tripName: '',
      startDate: new Date(),
      numberOfPeople: 1,
      startTime: '09:00',
      budget: 'Economy',
      favouriteCategories: [],
    },
  })

  const onSubmit = (values: z.infer<typeof createTripSchema>) => {
    console.log(values)
    localStorage.setItem('trip', JSON.stringify(values))
    nextStep()
  }

  const parse2DArray = (data: string[]) => {
    let temp: string[][] = []
    let row: string[] = []
    console.log(data)

    data.forEach((item, index) => {
      if (index % ITEM_PER_ROW === 0 && index !== 0) {
        console.log(index)
        temp.push(row)
        row = []
      }
      row.push(item)
    })
    row.length && temp.push(row)
    setActivities(temp)
    setIsLoading(false)
  }

  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await fetchData('GET', 'maincategory')
        const data = await response.json()
        console.log(data)
        parse2DArray(data.categoryList)
      } catch (error) {
        console.error(error)
      }
    }
    getActivities()
  }, [])

  function updateSelectedActivities(e: any) {
    const activity = e.target.value

    let newActivities = createTripForm.getValues(
      'favouriteCategories',
    ) as number[]
    const currentIndex = newActivities.indexOf(activity)
    if (currentIndex === -1) {
      newActivities.push(activity)
    } else {
      newActivities.splice(currentIndex, 1)
    }
    createTripForm.setValue('favouriteCategories', newActivities as any)
  }

  const nextStep = () => {
    setIndex(index + 1)
  }

  return (
    <main className='flex flex-col items-center'>
      {index === -1 ? (
        <>
          <h1 className='text-primary font-medium text-4xl mb-10'>
            Explore your adventure
          </h1>
          <Form {...createTripForm}>
            <div className='relative w-2/4 h-[300px]'>
              {tripName === '' && (
                <div className='absolute z-[999] backdrop-blur-md w-full h-full flex items-center justify-center'>
                  <FormField
                    control={createTripForm.control}
                    name='tripName'
                    render={({ field }) => {
                      return (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 100,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className='w-1/2'
                        >
                          <FormItem>
                            <FormLabel>
                              What should we call your trip?
                            </FormLabel>
                            <FormControl>
                              <div className='flex gap-4'>
                                <Input
                                  className='block'
                                  {...field}
                                  {...createTripForm.register('tripName', {
                                    required: true,
                                  })}
                                  placeholder='Something awesome!'
                                />
                                <Button
                                  type='button'
                                  onClick={() => {
                                    createTripForm
                                      .trigger('tripName')
                                      .then(valid => {
                                        if (valid) {
                                          setTripName(field.value)
                                        }
                                      })
                                  }}
                                >
                                  <ArrowRight />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </motion.div>
                      )
                    }}
                  />
                </div>
              )}
              {tripName !== '' && (
                <form
                  onSubmit={createTripForm.handleSubmit(onSubmit)}
                  className='relative grid grid-cols-2 gap-x-4 p-8 w-full'
                >
                  <>
                    <motion.div
                      className='flex flex-col gap-4'
                      initial={{
                        opacity: 0,
                        x: -100,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                    >
                      <FormField
                        control={createTripForm.control}
                        name='startDate'
                        render={({ field }) => (
                          <FormItem className='flex flex-col w-full'>
                            <FormLabel>Select date & time</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                      <div className='flex gap-3'>
                        <FormField
                          control={createTripForm.control}
                          name='startTime'
                          render={({ field }) => {
                            return (
                              <FormItem className='flex-1'>
                                <FormLabel>From</FormLabel>
                                <FormControl>
                                  <Input
                                    className='w-full'
                                    type='time'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={createTripForm.control}
                          name='numberOfPeople'
                          render={({ field }) => {
                            return (
                              <FormItem className='flex-1'>
                                <FormLabel>Total people</FormLabel>
                                <FormControl>
                                  <Input
                                    className='block'
                                    type='number'
                                    min='1'
                                    max='5'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                      </div>
                      <FormField
                        control={createTripForm.control}
                        name='budget'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel>My budget: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                onValueChange={values => {
                                  const value = values[0]
                                  if (value === 33) {
                                    field.onChange('Economy')
                                  } else if (value === 66) {
                                    field.onChange('Standard')
                                  } else {
                                    field.onChange('Luxury')
                                  }
                                }}
                                defaultValue={[33]}
                                max={99}
                                step={33}
                                min={33}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      className='px-4'
                      initial={{
                        opacity: 0,
                        x: 100,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                    >
                      <h3 className='text-center text-lg mb-2'>
                        Select your favourites activities
                      </h3>
                      {isLoading ? (
                        <div className='flex justify-center'>
                          <LoaderCircle className='animate-spin h-10 w-10' />
                        </div>
                      ) : (
                        <FormField
                          control={createTripForm.control}
                          name='favouriteCategories'
                          render={() => (
                            <FormItem>
                              <div className='flex items-center flex-col gap-3'>
                                {activities.map((_, i) => {
                                  return (
                                    <div className='flex gap-4' key={i}>
                                      {activities[i].map((activity, index) => (
                                        <div key={i * ITEM_PER_ROW + index}>
                                          <div key={i * ITEM_PER_ROW + index}>
                                            <Toggle
                                              className='flex gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
                                              key={i * ITEM_PER_ROW + index}
                                              variant='outline'
                                              onClick={() => {
                                                updateSelectedActivities({
                                                  target: {
                                                    value: activity,
                                                  },
                                                })
                                              }}
                                            >
                                              <div className='flex gap-2 items-center'>
                                                {icon[activity]}
                                                {activity}
                                              </div>
                                            </Toggle>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>
                  </>
                  <motion.div
                    className='col-start-2 justify-self-end'
                    initial={{
                      opacity: 0,
                      y: 100,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <Button type='submit' className=''>
                      Create trip
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </Form>
        </>
      ) : (
        <div className='flex gap-12 h-[500px] w-2/3'>
          <div className='w-1/2'>
            {Steps[index]({ selectedPlaces, setSelectedPlaces, setIndex })}
          </div>
          <div className='w-1/2 relative'>
            <Map selectedPlaces={selectedPlaces} />
          </div>
        </div>
      )}
    </main>
  )
}
