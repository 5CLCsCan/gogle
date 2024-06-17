import TripModel from '@/models/TripSchema';
import { connectDB, addData } from '@/lib/database';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { start } from 'repl';

export interface CreateTripData {
    userID: string;
    startDate: string;
    startTime: number;
    tripLength: number;
    numberOfPeople: number;
    budget: string[];
    favouriteCategories: string[];
}


export default async function createTrip(data: CreateTripData): Promise<boolean> {
    const { userID, startDate, startTime, tripLength, numberOfPeople, budget, favouriteCategories } = data;
    const userFilter = new UserFilter(startTime, new Date(startDate), tripLength, numberOfPeople, budget, favouriteCategories);
    const newTrip = new TripModel({
        userID: userID,
        userFilter: userFilter,
    });

    console.log("new trip created:" + newTrip);
    const status = await addData(newTrip);
    return status;
}
