import TripModel, { ITrip } from '@/models/TripSchema'
import { connectDB, findData, findAndUpdateData } from '@/lib/backend/database'

export interface RemoveDestinationData {
  tripID: string
  placeID: string
}

/**
 * Removes a destination from a trip.
 * 
 * @param {RemoveDestinationData} data - The placeID of a trip ID and TripID itself.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function removeDestination(data: RemoveDestinationData): Promise<boolean> {
  try {
    await connectDB()

    const { tripID, placeID } = data
    const trips: ITrip[] | null = await findData(TripModel, { _id: tripID })

    if (!trips || trips.length === 0) {
      console.log('Trip not found')
      return false
    }

    const trip = trips[0];
    if (!trip.locationsID) {
      trip.locationsID = [];
    }
    const updatedLocations = trip.locationsID.filter((location) => location !== placeID);

    const update = { $set: { locationsID: updatedLocations } };
    const updatedTrip: ITrip | null = await findAndUpdateData(TripModel, { _id: tripID }, update);

    if (updatedTrip) {
      console.log('Destination removed successfully')
      return true
    } else {
      console.log('Failed to remove destination')
      return false
    }
  } catch (err) {
    console.error('Error removing destination:', err)
    return false
  }
}
