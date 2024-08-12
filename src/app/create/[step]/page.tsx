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
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [selectedPlaces],
  )
  const { step } = params
  return (
    <section className='flex justify-center'>
      <div className='h-[500px] flex gap-12 w-2/3'>
        <div className='w-[40%] h-[inherit]'>
          {steps[step]({
            selectedPlaces,
            setSelectedPlaces,
          })}
        </div>
        <div className='w-[60%]'>
          <Map selectedPlaces={selectedPlaces} />
        </div>
      </div>
    </section>
  )
}
