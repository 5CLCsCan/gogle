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
  budget: string[]
  favouriteCategories: string[]
}

/**
 * Create a new trip in the database.
 *
 * @param {CreateTripData} data - The data for creating a new trip.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function createTrip(
  data: CreateTripData,
): Promise<ITrip | boolean> {
  const {
    userID,
    startDate,
    startTime,
    tripLength,
    numberOfPeople,
    budget,
    favouriteCategories,
  } = data
  const userFilter = new UserFilter(
    startTime,
    new Date(startDate),
    tripLength,
    numberOfPeople,
    budget,
    favouriteCategories,
  )
  const newTrip = new TripModel({
    userID: userID,
    userFilter: userFilter,
  })

  const newData: ITrip | Boolean = await createData(newTrip)
  return newData ? newTrip : false
}
