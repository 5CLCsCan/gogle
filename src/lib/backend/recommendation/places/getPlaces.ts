import * as utils from '@/lib/backend/utils/utils';
import * as database from '@/lib/backend/database';
import Places, { IPlace } from '@/models/PlaceSchema';
import TripModel, { ITrip } from '@/models/TripSchema';
import getRecommendCategory from "@/lib/backend/recommendation/category/getRecommendCategory";
import IGetRCMPlaceData from "@/lib/backend/recommendation/category/IGetRCMdata";

const LimitPlace = 10;
const LimitPlacePerCategory = LimitPlace / 3;

interface QueryOptions {
    lat: number;
    long: number;
    radius?: number;
    time?: number;
    category_list: string[];
    place_visited: string[];   
}

interface IPlaceProjection {
    _id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imgLink: string;
    category: string;
    priceRange: number[];
    openingTime: string[];
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

function getRangeTime(place: IPlace, time: number): string[] | null {
    let dayOfWeek = (utils.getDay() + 6) % 7;
    for (let i = 0; i < place.openingTime[dayOfWeek].length; i++) {
        let openTime = utils.convertTime2Num(place.openingTime[dayOfWeek][i][0]);
        let closeTime = utils.convertTime2Num(place.openingTime[dayOfWeek][i][1]);
        if (openTime > closeTime) {
            if (time >= openTime || time <= closeTime) return [place.openingTime[dayOfWeek][i][0], place.openingTime[dayOfWeek][i][1]];
        }
        else if (time >= openTime && time <= closeTime) return [place.openingTime[dayOfWeek][i][0], place.openingTime[dayOfWeek][i][1]];
    }
    return null;
}

function validPlace(place: IPlace, query: QueryOptions): boolean {
    let distance = utils.calculateDistance(query.lat, query.long, place.latitude, place.longitude);
    if (query.radius && distance > query?.radius) return false;
    if (query.time && !getRangeTime(place, query.time)) return false;
    return true;
}

async function getPlacesbyQuery(query: QueryOptions): Promise<IPlace[]> {
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
        if (query.time) {
            let key = `open_${query.time}`;
            queryByCat[key] = 1;
        }
        let numPlaces = LimitPlacePerCategory;
        let placesByCat: IPlace[] | null = await database.findData(Places, queryByCat, numPlaces * 2);
        if (!placesByCat || placesByCat.length === 0) {
            console.log("NULL");
            continue;
        }
        for (let j = 0; j < placesByCat.length; j++) {
            if (!validPlace(placesByCat[j], query)) continue;
            places.push(placesByCat[j]);
        }
        if (places.length >= LimitPlace) break;
    }
    return places;   
}

function cleaningPlaces(places: IPlace[], time: number | undefined): IPlaceProjection[] {
    let result: IPlaceProjection[] = [];
    if (!time) time = utils.getTimeNumber();
    for (let i = 0; i < places.length; i++) {
        result.push({
            _id: places[i]._id as string,
            name: places[i].name,
            address: places[i].address,
            latitude: places[i].latitude,
            longitude: places[i].longitude,
            imgLink: places[i].imgLink,
            category: places[i].category,
            priceRange: places[i].priceRange,
            openingTime: getRangeTime(places[i], time) as string[]
        });
    }
    return result;
}

export async function getPlaces(rcm_data: IGetRCMPlaceData) : Promise<IPlaceProjection[] | string>{
    const trip = await database.findData(TripModel, { _id: rcm_data.tripID });
    if (!trip || trip.length === 0) {
        return 'Trip not found';
    }
    
    let categories = await getRecommendCategory(rcm_data);
    let query: QueryOptions = {
        lat: trip[0].last_latitude,
        long: trip[0].last_longitude,
        radius: trip[0].userFilter?.maxDistance ?? undefined,
        category_list: categories,
        place_visited: trip[0].locationsID,
        time: trip[0].userFilter.startTime !== undefined ? Math.ceil(trip[0].userFilter.startTime as number) : undefined
    };
    let places = await getPlacesbyQuery(query);
    // console.log(places[0]._id);
    let placesProjection = cleaningPlaces(places, query.time);
    return placesProjection;
}