import { NextRequest } from "next/server";
import addDestination, { AddDestinationData } from '@/lib/backend/updateData/addDestination';
import removeDestination, { RemoveDestinationData } from '@/lib/backend/updateData/removeDestination';
import { getPlaces } from "@/lib/backend/recommendation/places/getPlaces";
import { jsonHeader } from "@/lib/backend/header/jsonheader";

/**
*   @swagger
*   /api/places:
*     get:
*       description: Retrieve a list of places for a given trip ID
*       parameters:
*         - name: tripID
*           in: query
*           required: true
*           description: The tripID of the trip
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the list of places
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                     name:
*                       type: string
*                     address:
*                       type: string
*                     latitude:
*                       type: number
*                     longitude:
*                       type: number
*                     imgLink:
*                       type: string
*                     openingTime:
*                       type: array
*                       items:
*                           type: string
*                     price_range:
*                       type: array
*                       items:
*                         type: number
*                       example: [50000, 100000]
*/



export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const search_params = new URLSearchParams(url.searchParams);
    const tripID = search_params.get('tripID');
    if (!tripID) {
        return new Response(JSON.stringify({ error: "Missing tripID" }), { status: 400 });
    }
    const places = await getPlaces(tripID);
    return new Response(JSON.stringify(places), jsonHeader);
}


/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Add a destination to a trip
 *     description: Add a new destination to a trip by providing the trip ID and place ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripID:
 *                 type: string
 *                 description: The ID of the trip.
 *               placeID:
 *                 type: string
 *                 description: The ID of the place to add.
 *     responses:
 *       200:
 *         description: A JSON object indicating the success status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
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

/**
 * @swagger
 * /api/places:
 *   delete:
 *     summary: Remove a destination from a trip
 *     description: Remove an existing destination from a trip by providing the trip ID and place ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripID:
 *                 type: string
 *                 description: The ID of the trip.
 *               placeID:
 *                 type: string
 *                 description: The ID of the place to remove.
 *     responses:
 *       200:
 *         description: A JSON object indicating the success status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
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