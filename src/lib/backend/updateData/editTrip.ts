import TripModel from '@/models/TripSchema';

/**
 * Interface representing the data required to edit a trip.
 */
export interface EditTripData {
  tripID: string;
  newTripName: string;
  newStartTime: string;
  newDate: Date;
}

/**
 * Edits the name and start time of a trip.
 *
 * @param {EditTripData} data - The data containing the trip ID, new trip name, and new start time.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success or failure.
 */
export default async function editTrip(data: EditTripData): Promise<boolean> {
  try {
    const result = await TripModel.updateOne(
      { _id: data.tripID },
      { 
        $set: { 
          tripName: data.newTripName,
          'userFilter.startTime': data.newStartTime,
          'userFilter.date': data.newDate
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('Trip updated successfully');
      return true;
    } else {
      console.log('No changes made to the trip');
      return false;
    }
  } catch (err) {
    console.error('Error updating trip:', err);
    return false;
  }
}
