import TripModel from '@/models/TripSchema'
import { connectDB, deleteData } from '@/lib/backend/database'

export interface RemoveTripData {
  tripID: string
}

/**
 * Remove a trip from the database.
 * 
 * @param {RemoveTripData} data - The trip's ID to be removed.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function removeTrip(data: RemoveTripData): Promise<boolean> {
    await connectDB();
    const { tripID } = data;
    const status = await deleteData(TripModel, { _id: tripID });
    return status;
}
