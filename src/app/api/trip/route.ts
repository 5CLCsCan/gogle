import { NextRequest } from "next/server";
import createTrip, { CreateTripData } from "@/lib/backend/updateData/createTrip";
import removeTrip, { RemoveTripData } from "@/lib/backend/updateData/removeTrip";

const database = require('@/lib/database');

// create new Trip

export async function POST(req: NextRequest) {
    // if (req.method === 'POST') {
    try {
        const parseData = await req.json();
        const data : CreateTripData = {
            userEmail: parseData.userEmail,
            startDate: parseData.startDate,
            startTime: parseData.startTime,
            locations: parseData.locations,
            sharedEmails: parseData.sharedEmails
        };
        const status = await createTrip(data);
        return new Response(JSON.stringify({ status: status }));
    } catch (error) {
        console.error("Error in POST /api/createTrip:", error);
        return new Response(JSON.stringify({ status: false }));
    }
    // } else {
    //     return new Response("Invalid Method");
    // }
}


// delete Trip
export async function DELETE(req: NextRequest) {
    // if (req.method === 'DELETE') {
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
    // } else {
    //     return new Response("Invalid Method");
    // }
}