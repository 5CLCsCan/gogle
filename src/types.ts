import { number } from 'zod'

export type MapCenterType = {
  lat: number
  lng: number
}

export type Place = {
  _id: string
  name: string
  address: string
  latitute: number
  longitude: number
  imgLink: string
  openTime: string[]
  priceRange: number[]
}

export type Trip = {
  _id: string
  userID: string
  userFilter: {
    latitude: number
    longitude: number
    startTime: string
    date: string
    maxDistance: number
    numberOfPeople: number
    budget: string
    favouriteCategories: string[]
  }
  userState: {
    maxSatiation: number
    maxTiredness: number
    maxThirsty: number
    satiation: number
    tiredness: number
    thirsty: number
  }
  last_latitude: number
  last_longitude: number
}
