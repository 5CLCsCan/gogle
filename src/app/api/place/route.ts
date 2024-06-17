import { NextRequest } from "next/server";
import addDestination, { AddDestinationData } from '@/lib/backend/updateData/addDestination';
import getPlace, { GetPlaceData } from '@/lib/backend/updateData/getPlace';
import removeDestination, { RemoveDestinationData } from '@/lib/backend/updateData/removeDestination';

/**
*/
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search_params = new URLSearchParams(url.searchParams);
        const placeID = search_params.get('placeID');
        console.log("PLACE ID : " + placeID);
        if (!placeID) {
            return new Response(JSON.stringify({ status: false }));
        }
        const data: GetPlaceData = { placeID: placeID };

        const status = await getPlace(data);
        return new Response(JSON.stringify(data));
    } catch (error) {
        console.error("Error in GET /api/getPlace:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}

/**
*/
export async function POST(req: NextRequest) {
    try {
        const parseData = await req.json();
        const data: AddDestinationData = {
            tripID: parseData.tripID,
            placeID: parseData.placeID
        };
        const status = await addDestination(data);
        return new Response(JSON.stringify({ status: status }));
    } catch (error) {
        console.error("Error in POST /api/addPlace:", error);
        return new Response(JSON.stringify({ status: false }));
    }

}

/*
*/
export async function DELETE(req: NextRequest) {
    try {
        const parseData = await req.json();
        const data: RemoveDestinationData = {
            tripID: parseData.tripID,
            placeID: parseData.placeID
        };
        const status = await removeDestination(data);
        return new Response(JSON.stringify({ status: status }));
    } catch (error) {
        console.error("Error in POST /api/removePlace:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}