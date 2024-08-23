'use client'

import { Place, Trip } from '@/types'
import { fetchData } from '@/utils/fetchData'
import dynamic from 'next/dynamic'
import { Fragment, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { cn, formatter } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createTripSchema, icon } from '@/app/create/page'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Slider } from '@/components/ui/slider'

type TripDetailsPageProps = {
  params: {
    id: string
  }
}

const budgetStringToNumber: {
  [key: string]: number
} = {
  Economy: 33,
  Standard: 66,
  Luxury: 99,
}

export default function TripDetails({ params }: TripDetailsPageProps) {
  const [trip, setTrip] = useState<Trip>({} as Trip)
  const [places, setPlaces] = useState<Place[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const { id } = params
  const editTripForm = useForm({
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
      editTripForm.setValue('tripName', data.trip.tripName)
      editTripForm.setValue('startDate', new Date(data.trip.userFilter.date))
      editTripForm.setValue(
        'numberOfPeople',
        data.trip.userFilter.numberOfPeople,
      )
      editTripForm.setValue('startTime', data.trip.userFilter.startTime)
      editTripForm.setValue('budget', data.trip.userFilter.budget)
      editTripForm.setValue(
        'favouriteCategories',
        data.trip.userFilter.favouriteCategories,
      )
    }

    const fetchActivities = async () => {
      const resp = await fetchData('GET', 'maincategory')
      if (resp.status !== 200) {
        console.error('Error fetching activities')
        return
      }
      const data = await resp.json()
      console.log(data.categoryList)
      setActivities(data.categoryList)
    }

    fetchTrip()
    fetchActivities()
  }, [])

  function updateSelectedActivities(e: any) {
    const activity = e.target.value

    let newActivities = editTripForm.getValues(
      'favouriteCategories',
    ) as number[]
    const currentIndex = newActivities.indexOf(activity)
    if (currentIndex === -1) {
      newActivities.push(activity)
    } else {
      newActivities.splice(currentIndex, 1)
    }
    editTripForm.setValue('favouriteCategories', newActivities as any)
  }

  function isIncluded(activity: string) {
    // console.log(editTripForm.getValues('favouriteCategories') as string[])
    // console.log(activity)

    return (
      (editTripForm.getValues('favouriteCategories') as string[]).indexOf(
        activity,
      ) !== -1
    )
  }

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  )

  const onSubmit = async (data: any) => {
    console.log(data)
    const body = {
      tripName: data.tripName,
      userFilter: {
        date: data.startDate,
        startTime: data.startTime,
        numberOfPeople: data.numberOfPeople,
        favouriteCategories: data.favouriteCategories,
        budget: data.budget,
      },
    }
    const resp = await fetchData('PUT', `trip/${id}`, 0, body)
    if (resp.status !== 200) {
      console.error('Error updating trip')
      return
    }
    const updatedTrip = await resp.json()
    console.log(updatedTrip)
    setTrip(updatedTrip)
  }

  return (
    <section className='flex flex-col items-center'>
      <div className='flex w-3/4 items-center mb-5'>
        <h1 className='text-primary text-3xl ml-auto'>Trip: {trip.tripName}</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='float-right ml-auto' variant='default'>
              Edit
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Changing trip's info</SheetTitle>
              <Form {...editTripForm}>
                <form
                  onSubmit={editTripForm.handleSubmit(onSubmit)}
                  id='edit-form'
                >
                  <FormField
                    control={editTripForm.control}
                    name='tripName'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Trip's name</FormLabel>
                          <FormControl>
                            <Input className='block' type='text' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={editTripForm.control}
                    name='startDate'
                    render={({ field }) => {
                      return (
                        <FormItem className='flex flex-col w-full'>
                          <FormLabel>Date & time</FormLabel>
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
                              className='w-auto p-0 z-[9999]'
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
                      )
                    }}
                  />
                  <FormField
                    control={editTripForm.control}
                    name='startTime'
                    render={({ field }) => {
                      return (
                        <FormItem className='flex-1'>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input className='w-full' type='time' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={editTripForm.control}
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
                  <FormField
                    control={editTripForm.control}
                    name='favouriteCategories'
                    render={() => (
                      <FormItem>
                        <FormLabel>Activities</FormLabel>
                        <div className='grid grid-cols-3 items-center gap-3'>
                          {activities.map((activity, i) => {
                            return (
                              <Toggle
                                pressed={isIncluded(activity)}
                                className='flex gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
                                key={activity}
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
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editTripForm.control}
                    name='budget'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Budget: {field.value}</FormLabel>
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
                            defaultValue={[budgetStringToNumber[field.value]]}
                            max={99}
                            step={33}
                            min={33}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
                <Button type='submit' form='edit-form'>
                  Save
                </Button>
              </Form>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className='flex gap-4 h-[500px] w-3/4'>
        <div className='w-1/2 flex flex-col gap-4'>
          {places.map((place, index) => (
            <Fragment key={index}>
              <div
                className={cn(
                  'flex justify-between items-center',
                  index % 2 === 1 ? 'flex-row-reverse text-right' : '',
                )}
              >
                <div key={place.id}>
                  <h3 className='font-medium text-xl'>{place.name}</h3>
                  <p className='italic text-black/40 text-sm'>
                    {place.address}
                  </p>
                  <p>
                    {place.priceRange
                      ? `${formatter.format(
                          place.priceRange[0],
                        )} - ${formatter.format(place.priceRange[1])}`
                      : 'VND 50,000 - VND 100,000'}
                  </p>
                </div>
                <Image
                  src={place.imgLink}
                  alt={place.name}
                  height={80}
                  width={80}
                  className='rounded-full h-20'
                />
              </div>
              <hr />
            </Fragment>
          ))}
        </div>
        <div className='w-1/2'>
          <Map selectedPlaces={places} />
        </div>
      </div>
    </section>
  )
}
