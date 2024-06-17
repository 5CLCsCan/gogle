import TripModel, { ITrip } from '@/models/TripSchema';
import { connectDB, findData, findAndUpdateData } from '@/lib/database';

export interface AddDestinationData {
  tripID: string;
  placeID: string;
}

export default async function addDestination(data: AddDestinationData): Promise<boolean> {
  try {
    await connectDB();

    const { tripID, placeID } = data;
    const trips: ITrip[] | null = await findData(TripModel, { _id: tripID });

    if (!trips || trips.length === 0) {
      console.log("Trip not found");
      return false;
    }
    
    const trip = trips[0];
    if (!trip.locationsID) {
      trip.locationsID = [];
    }
    const updatedLocations = [...trip.locationsID, placeID];
    const update = { $set: { locationsID: updatedLocations } };
    const updatedTrip: ITrip | null = await findAndUpdateData(TripModel, { _id: tripID }, update);

    if (updatedTrip) {
      console.log("Destination added successfully");
      return true; 
    } else {
      console.log("Failed to add destination");
      return false;
    }
  } catch (err) {
    console.error("Error adding destination:", err);
    return false;
  }
}
