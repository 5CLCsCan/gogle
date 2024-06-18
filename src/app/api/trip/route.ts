import { NextRequest } from "next/server";
import createTrip, { CreateTripData } from "@/lib/backend/updateData/createTrip";
import removeTrip, { RemoveTripData } from "@/lib/backend/updateData/removeTrip";

const database = require('@/lib/database');

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
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The budget for the trip.
 *               favouriteCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The favorite categories for the trip.
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