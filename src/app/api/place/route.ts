import { NextRequest } from "next/server";
import addDestination, { AddDestinationData } from '@/lib/backend/updateData/addDestination';
import getPlace, { GetPlaceData } from '@/lib/backend/updateData/getPlace';
import removeDestination, { RemoveDestinationData } from '@/lib/backend/updateData/removeDestination';

/**
 * @swagger
 * /api/place:
 *   get:
 *     summary: Get place details
 *     description: Retrieve the details of a specific place by its ID.
 *     parameters:
 *       - in: query
 *         name: placeID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the place to retrieve.
 *     responses:
 *       200:
 *         description: A JSON object containing the place details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 placeID:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       500:
 *         description: Internal server error.
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

        const fetchedData = await getPlace(data);
        return new Response(JSON.stringify(fetchedData));
    } catch (error) {
        console.error("Error in GET /api/getPlace:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}

/**
 * @swagger
 * /api/place:
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
 * /api/place:
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