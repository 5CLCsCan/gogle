import { NextRequest } from "next/server";
import createTrip, { CreateTripData } from "@/lib/backend/updateData/createTrip";
import removeTrip, { RemoveTripData } from "@/lib/backend/updateData/removeTrip";

const database = require('@/lib/database');

/**
 * 
 */
export async function POST(req: NextRequest) {
    try {
        console.log("POST /api/createTrip");
        console.log(req);
        const parseData = await req.json();
        console.log(parseData)
        const data : CreateTripData = {
            userID: parseData.userID,
            startDate: parseData.startDate,
            startTime: parseData.startTime,
            tripLength: parseData.tripLength,
            numberOfPeople: parseData.numberOfPeople,
            budget: parseData.budget,
            favouriteCategories: parseData.favouriteCategories
        };
        const status = await createTrip(data);
        return new Response(JSON.stringify({ status: status }));
    } catch (error) {
        console.error("Error in POST /api/createTrip:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}

/**
 * 
 */
export async function DELETE(req: NextRequest) {
    try {
        const parseData = await req.json();
        const data: RemoveTripData = {
            tripID: parseData.tripID
        };
        const status = await removeTrip(data);
        return new Response(JSON.stringify({ status: status }));
    } catch (error) {
        console.error("Error in POST /api/removeTrip:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}