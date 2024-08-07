import Places, { IPlace } from '@/models/PlaceSchema';
import TripModel from '@/models/TripSchema';
import { connectDB, findData } from '@/lib/backend/database';
import { ITrip } from '@/models/TripSchema';

export default async function getTripPlaces(tripID: string): Promise<IPlace[] | false> {
    await connectDB();

    const trip: ITrip[] | null = await findData(TripModel, { _id: tripID });
    if (!trip) return false;
    const places = trip[0].locationsID;
    const tripPlaces: IPlace[] = [];
    for (const placeID of places) {
        const place: IPlace[] | null = await findData(Places, { id: placeID });
        if (place) tripPlaces.push(place[0]);
    }
    return tripPlaces;
}