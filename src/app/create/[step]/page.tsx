'use client'

import FirstStep from '../(step)/FirstStep'
import SecondStep from '../(step)/SecondStep'

type CreateTripStepPage = {
  params: {
    step: string
  }
}

type StepPage = {
  [key: string]: JSX.Element
}

const steps: StepPage = {
  '1': <FirstStep />,
  '2': <SecondStep />,
}

export default function CreateTripStepPage({ params }: CreateTripStepPage) {
  const { step } = params
  return <div>{steps[step]}</div>
}
