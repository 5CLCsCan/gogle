'use client'

import { MapCenterType, Place } from '@/types'
import FirstStep from '../(step)/FirstStep'
import SecondStep from '../(step)/SecondStep'
import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

type CreateTripStepPage = {
  params: {
    step: string
  }
}

export type CreatTripStepPageProps = {
  center: MapCenterType
  setCenter: (center: MapCenterType) => void
  radius: number
  setRadius: (radius: number) => void
  selectedPlaces?: Place[]
  setSelectedPlaces?: (places: Place[]) => void
}

type StepPage = {
  [key: string]: (props: CreatTripStepPageProps) => JSX.Element
}

const steps: StepPage = {
  '1': props => <FirstStep {...props} />,
  '2': props => <SecondStep {...props} />,
}

export const defaultCenter: MapCenterType = {
  lat: 10.762328,
  lng: 106.6827293,
}

export default function CreateTripStepPage({ params }: CreateTripStepPage) {
  const [center, setCenter] = useState<MapCenterType>(defaultCenter)
  const [radius, setRadius] = useState<number>(0)
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [center, radius, selectedPlaces],
  )
  const { step } = params
  return (
    <section className='flex justify-center'>
      <div className='h-[500px] flex gap-12 w-2/3'>
        <div className='w-[40%] h-[inherit]'>
          {steps[step]({
            center,
            setCenter,
            radius,
            setRadius,
            selectedPlaces,
            setSelectedPlaces,
          })}
        </div>
        <div className='w-[60%]'>
          <Map
            center={center}
            radius={radius}
            selectedPlaces={selectedPlaces}
          />
        </div>
      </div>
    </section>
  )
}
