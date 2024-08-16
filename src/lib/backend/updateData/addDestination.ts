import TripModel, { ITrip } from '@/models/TripSchema'
import { connectDB, findData, findAndUpdateData } from '@/lib/backend/database'
import Places, { IPlace } from '@/models/PlaceSchema'

export interface AddDestinationData {
  tripID: string
  placeID: string
}

/**
 * Adds a destination to a trip.
 *
 * @param {AddDestinationData} data - The data containing the trip ID and place ID.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function addDestination(
  data: AddDestinationData,
): Promise<boolean> {
  try {
    const result = await TripModel.updateOne( { _id: data.tripID }, { $push: { locationsID: data.placeID } } )

    if (result) {
      console.log('Destination added successfully')
      return true
    } else {
      console.log('Failed to add destination')
      return false
    }
  } catch (err) {
    console.error('Error adding destination:', err)
    return false
  }
}
