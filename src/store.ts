import { create } from 'zustand'
import { MapCenterType } from './types'

type CenterStore = {
  center: MapCenterType
  setCenter: (center: MapCenterType) => void
}

export const defaultCenter: MapCenterType = {
  lat: 10.762328,
  lng: 106.6827293,
}

export const useCenterStore = create<CenterStore>(set => ({
  center: defaultCenter,
  setCenter: center => set({ center }),
}))

type RadiusStore = {
  radius: number
  setRadius: (radius: number) => void
}

export const useRadiusStore = create<RadiusStore>(set => ({
  radius: 4000,
  setRadius: radius => set({ radius }),
}))
