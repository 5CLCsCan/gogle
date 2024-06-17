import TripModel from '@/models/TripSchema';
import { connectDB, deleteData } from '@/lib/database';

export interface RemoveTripData {
    tripID: string;
}

export default async function removeTrip(data: RemoveTripData): Promise<boolean> {
    await connectDB();
    const { tripID } = data;
    const status = await deleteData(TripModel, { _id: tripID });
    return status;
}
