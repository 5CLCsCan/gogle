import TripModel from '@/models/TripSchema'
import { createData } from '@/lib/backend/database'
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter'
import { ITrip } from '@/models/TripSchema'

export interface CreateTripData {
  userID: string
  startDate: string
  startTime: number
  tripLength: number
  numberOfPeople: number
  budget: string
  favouriteCategories: string[]
  latitude: number
  longitude: number
}

/**
 * Create a new trip in the database.
 *
 * @param {CreateTripData} data - The data for creating a new trip.
 * @returns {Promise<ITrip | boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function createTrip(
  data: CreateTripData,
): Promise<ITrip | Boolean> {
  const {
    userID,
    startDate,
    startTime,
    tripLength,
    numberOfPeople,
    budget,
    favouriteCategories,
    latitude,
    longitude,
  } = data
  console.log(data)
  const userFilter = new UserFilter(
    startTime,
    new Date(startDate),
    tripLength,
    numberOfPeople,
    budget,
    favouriteCategories,
    latitude,
    longitude,
  )
  const newTrip = new TripModel({
    userID: userID,
    userFilter: userFilter,
  })
  if (userFilter.latitude) newTrip.last_latitude = userFilter.latitude
  if (userFilter.longitude) newTrip.last_longitude = userFilter.longitude
  const tripData: ITrip | Boolean = await createData(newTrip)
  if (tripData == false) {
    console.error('Error in createTrip: Failed to create trip')
    return false
  }
  return tripData
}