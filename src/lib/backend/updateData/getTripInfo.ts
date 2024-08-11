import Places, { IPlace } from '@/models/PlaceSchema';
import TripModel from '@/models/TripSchema';
import { connectDB, findData } from '@/lib/backend/database';
import { ITrip } from '@/models/TripSchema';
import mongoose from 'mongoose';

export interface GetTripData {
    status: boolean;
    trip: ITrip;
    places: IPlace[];
}

export default async function getTripPlaces(tripID: string): Promise<GetTripData | false> {
    await connectDB();

    const trip: ITrip[] | null = await findData(TripModel, { _id: tripID });
    if (!trip) return false;
    const places = trip[0].locationsID;
    const tripPlaces: IPlace[] = [];
    for (const placeID of places) {
        const objectId = new mongoose.Types.ObjectId(placeID); // Convert to ObjectId
        const place: IPlace[] | null = await findData(Places, { _id: objectId });
        if (place) tripPlaces.push(place[0]);
    }
    const data = {
        status: true,
        trip: trip[0],
        places: tripPlaces,
    };
    return data;
}