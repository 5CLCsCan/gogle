import TripModel, { ITrip } from '@/models/TripSchema'
import { connectDB, findData } from '@/lib/backend/database'

/**
 * Fetches details of a trip by its user ID.
 *
 * @param {GetTripsData} data - The placeID.
 * @returns {Promise<ITrip[] | false>} - A promise that resolves to the place details or FALSE if not found.
 */
export default async function getTrips(
  userID: string,
): Promise<ITrip[] | false> {
  try {
    await connectDB()

    const trips: ITrip[] | null = await findData(TripModel, { userID: userID })
    return trips ? trips : []
  } catch (err) {
    console.error('Error getting trips:', err)
    return false
  }
}
