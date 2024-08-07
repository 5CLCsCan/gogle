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
    await connectDB()

    const { tripID, placeID } = data
    const trips: ITrip[] | null = await findData(TripModel, { _id: tripID })
    const places: IPlace[] | null = await findData(Places, { _id: placeID })
    if (!places) {
      console.log('Place not found')
      return false
    }
    if (!trips || trips.length === 0) {
      console.log('Trip not found')
      return false
    }

    const trip = trips[0]
    const place = places[0]

    const latitude = place.latitude
    const longitude = place.longitude

    if (!trip.locationsID) {
      trip.locationsID = []
    }
    const updatedLocations = [...trip.locationsID, placeID]
    const update = {
      $set: {
        locationsID: updatedLocations,
        last_latitude: latitude,
        last_longitude: longitude,
      },
    }
    const updatedTrip: ITrip | null = await findAndUpdateData(
      TripModel,
      { _id: tripID },
      update,
    )

    if (updatedTrip) {
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
