import Places, { IPlace } from '@/models/PlaceSchema';
import { connectDB, findData } from '@/lib/database';

export interface GetPlaceData {
  placeID: string;
}

export default async function getPlace(data: GetPlaceData): Promise<IPlace | false> {
  try {
    await connectDB();

    const { placeID } = data;
    const places: IPlace[] | null = await findData(Places, { _id: placeID });

    if (!places || places.length === 0) {
      console.log("Place not found");
      return false;
    }
    const place = places[0];
    return place;
  } catch (err) {
    console.error("Error getting place:", err);
    return false;
  }
}
