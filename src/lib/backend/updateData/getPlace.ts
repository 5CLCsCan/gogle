import Places, { IPlace } from '@/models/PlaceSchema';
import { connectDB, findData } from '@/lib/backend/database';

export interface GetPlaceData {
  placeID: string;
}

/**
 * Fetches details of a place by its ID.
 * 
 * @param {GetPlaceData} data - The placeID.
 * @returns {Promise<IPlace | false>} - A promise that resolves to the place details or FALSE if not found.
 */
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
    console.log(place);
    return place;
  } catch (err) {
    console.error("Error getting place:", err);
    return false;
  }
}
