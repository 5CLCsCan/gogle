import { NextRequest } from "next/server";
import createTrip, { CreateTripData } from "@/lib/backend/updateData/createTrip";
import removeTrip, { RemoveTripData } from "@/lib/backend/updateData/removeTrip";
import getTrips from "@/lib/backend/updateData/getTrips";

const database = require('@/lib/database');

/**
 * @swagger
 * /api/trip:
 *   get:
 *     summary: Get all trips of a user
 *     description: Retrieve all trips for a given user ID.
 *     parameters:
 *       - in: query
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user for whom to retrieve trips.
 *     responses:
 *       200:
 *         description: A JSON array of trips for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the trip.
 *                   userID:
 *                     type: string
 *                     description: The ID of the user.
 *                   userFilter:
 *                     type: object
 *                     description: The filter criteria used for the trip.
 *                     properties:
 *                       startTime:
 *                         type: number
 *                         description: The start time of the trip.
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         description: The start date of the trip.
 *                       tripLength:
 *                         type: number
 *                         description: The length of the trip in days.
 *                       numberOfPeople:
 *                         type: number
 *                         description: The number of people for the trip.
 *                       budget:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The budget preferences for the trip.
 *                       favouriteCategories:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The favorite categories for the trip.
 *       400:
 *         description: Missing or invalid userID parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 */
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search_params = new URLSearchParams(url.searchParams);
        const userID = search_params.get('userID');
        if (!userID) {
            return new Response(JSON.stringify({ status: false }));
        }
        const trips = await getTrips(userID);
        return new Response(JSON.stringify(trips));
    } catch (error) {
        console.error("Error in GET /api/trip:", error);
        return new Response(JSON.stringify([]));
    }
}
/**
 * @swagger
 * /api/trip:
 *   post:
 *     summary: Create a new trip
 *     description: Create a new trip with the provided trip details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user creating the trip.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the trip.
 *               startTime:
 *                 type: number
 *                 description: The start time of the trip.
 *               tripLength:
 *                 type: number
 *                 description: The length of the trip in days.
 *               numberOfPeople:
 *                 type: number
 *                 description: The number of people going on the trip.
 *               budget:
 *                 type: string
 *                 description: The budget for the trip.
 *               favouriteCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The favorite categories for the trip.
 *               longitude:
 *                 type: number
 *                 description: The longitude of the starting place. 
 *               latitude:
 *                 type: number
 *                 description: The latitude of the starting place.
 *     responses:
 *       200:
 *         description: A JSON object indicating the success status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: IPlace | false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 */
export async function POST(req: NextRequest) {
    try {
        const parseData = await req.json();
        // console.log(parseData)
        const data : CreateTripData = {
            userID: parseData.userID,
            startDate: parseData.startDate,
            startTime: parseData.startTime,
            tripLength: parseData.tripLength,
            numberOfPeople: parseData.numberOfPeople,
            budget: parseData.budget,
            favouriteCategories: parseData.favouriteCategories,
            latitude: parseData.latitude,
            longitude: parseData.longitude
        };
        const respone = await createTrip(data);
        return new Response(JSON.stringify({ status: respone }));
    } catch (error) {
        console.error("Error in POST /api/createTrip:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}

/**
 * @swagger
 * /api/trip:
 *   delete:
 *     summary: Remove a trip
 *     description: Remove an existing trip by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripID:
 *                 type: string
 *                 description: The ID of the trip to remove.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
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
