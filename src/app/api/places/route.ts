import { NextRequest } from "next/server";
import addDestination, { AddDestinationData } from '@/lib/backend/updateData/addDestination';
import removeDestination, { RemoveDestinationData } from '@/lib/backend/updateData/removeDestination';
import { getPlaces } from "@/lib/backend/recommendation/places/getPlaces";
import { jsonHeader } from "@/lib/backend/header/jsonheader";
import IGetRCMPlaceData from "@/lib/backend/recommendation/category/IGetRCMdata";

/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Retrieve a list of recommended places for a given trip ID
 *     description: Returns a list of recommended places associated with the specified trip ID, optionally filtered by categories. The method now requires a JSON body containing the `categories` instead of receiving it as a query parameter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripID:
 *                 type: string
 *                 description: The unique identifier of the trip.
 *                 example: "12345"
 *               categories:
 *                 type: string
 *                 nullable: true
 *                 description: A comma-separated list of categories to filter the places.
 *                 example: "food/bar-pub,food/sang-trong"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of places.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the place.
 *                   name:
 *                     type: string
 *                     description: The name of the place.
 *                   address:
 *                     type: string
 *                     description: The address of the place.
 *                   latitude:
 *                     type: number
 *                     description: The latitude coordinate of the place.
 *                   longitude:
 *                     type: number
 *                     description: The longitude coordinate of the place.
 *                   imgLink:
 *                     type: string
 *                     description: A URL link to an image of the place.
 *                   openingTime:
 *                     type: array
 *                     description: An array of strings representing opening times.
 *                     items:
 *                       type: string
 *                       description: Opening time of the place in a string format (e.g., "09:00 AM - 10:00 PM").
 *                   price_range:
 *                     type: array
 *                     description: The price range for the place.
 *                     items:
 *                       type: number
 *                     example: [50000, 100000]
 *       400:
 *         description: Bad Request. The request is missing the required tripID in the JSON body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example: Missing tripID
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message detailing the server error.
 */


export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    // const parseTripID = searchParams.get('tripID');
    // const categories = searchParams.get('categories');
    const parseData = await req.json();
    const parseTripID = parseData.tripID;
    const categories = parseData.categories;
    if (!parseTripID) {
        return new Response(JSON.stringify({ error: "Missing tripID" }), { status: 400 });
    }

    // const categoryList = categories ? categories.split(',') : [];
    const data: IGetRCMPlaceData = {
        tripID: parseTripID,
        category_list: categories
    };

    const places = await getPlaces(data);
    return new Response(JSON.stringify(places), jsonHeader);
}


/**
 * @swagger
 * /api/places:
 *   put:
 *     summary: Add a destination to a trip
 *     description: Add a new destination to a trip by providing the trip ID and place ID. This endpoint expects a JSON payload with `tripID` and `placeID`.
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
 *                 example: "12345"
 *               placeID:
 *                 type: string
 *                 description: The ID of the place to add.
 *                 example: "67890"
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
 *                   description: Indicates whether the operation was successful.
 *                   example: true
 *       500:
 *         description: Internal server error. An unexpected error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                   example: false
 */

export async function PUT(req: NextRequest) {
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