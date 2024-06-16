import * as utils from '@/lib/backend/utils/utils';
import * as database from '@/lib/backend/database';
import Places, { IPlace } from '@/models/PlaceSchema';

const LimitPlace = 10;
const LimitPlacePerCategory = LimitPlace / 3;

interface QueryOptions {
    lat: number;
    long: number;
    radius?: number;
    category_list: string[];
}

interface GridId {
    gridX: number;
    gridY: number;
}

function getLimitGrid(gridID: GridId, radius: number | null): number | null {
    if (radius === null) return null;
    const gridSize = Math.ceil(radius / utils.GRID_SIZE_KM);
    return gridSize;
}

function validPlace(place: IPlace, query: QueryOptions): boolean {
    let distance = utils.calculateDistance(query.lat, query.long, place.latitude, place.longitude);
    if (query.radius && distance > query?.radius) return false;
    return true;
}

export async function getPlaces(query: QueryOptions): Promise<IPlace[]> {
    let gridId: GridId = utils.getGridID(query.lat, query.long);
    let gridLimit: number | null = getLimitGrid(gridId, query?.radius ?? null);
    let places: IPlace[] = [];
    let query_db: any = {};
    if (gridLimit != null) {
        query_db = {
            gridX: { $gte: gridId.gridX - gridLimit, $lte: gridId.gridX + gridLimit },
            gridY: { $gte: gridId.gridY - gridLimit, $lte: gridId.gridY + gridLimit }
        }
    }
    for (let i = 0; i < query.category_list.length; i++) {
        let category = query.category_list[i];
        let queryByCat = query_db;
        queryByCat.category = category;
        console.log(queryByCat);
        let numPlaces = LimitPlacePerCategory;
        let placesByCat: IPlace[] | null = await database.findData(Places, queryByCat);
        if (!placesByCat || placesByCat.length === 0) continue;
        for (let j = 0; j < placesByCat.length; j++) {
            if (!validPlace(placesByCat[j], query)) continue;
            places.push(placesByCat[j]);
            numPlaces--;
            if (numPlaces === 0) break;
        }
    }
    return places;   
}