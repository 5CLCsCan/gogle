import Places, { IPlace } from '@/models/PlaceSchema';
import { findData } from '@/lib/database';


export default async function getCategory(placesID: string[]): Promise<string[]> {
    try {
        const categoryList: string[] = [];
        for (let i = 0; i < placesID.length; i++) {
            const placeID = placesID[i];
            const places: IPlace[] | null = await findData(Places, { _id: placeID });
        
            if (!places || places.length === 0) {
              console.log("Place not found");
              return [];
            }
            const place = places[0];
            categoryList.push(place.category);
        }
        return categoryList;
      } catch (err) {
        console.error("Error getting place:", err);
        return [];
      }
}
