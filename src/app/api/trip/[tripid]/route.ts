import { NextRequest, NextResponse } from 'next/server';
import getTripPlaces from '@/lib/backend/updateData/getTripInfo';
import * as utils from '@/lib/backend/utils/utils';
import { GetTripData } from '@/lib/backend/updateData/getTripInfo';
import editTrip, { EditTripData } from '@/lib/backend/updateData/editTrip';

/**
 * @swagger
 * /api/trip/[tripid]:
 *   get:
 *     summary: Retrieve trip details and associated places
 *     description: Retrieve details of a trip and a list of places associated with the specified trip ID.
 *     parameters:
 *       - name: tripid
 *         in: path
 *         required: true
 *         description: The unique identifier of the trip.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the trip details and list of associated places.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the retrieval was successful.
 *                 trip:
 *                   type: object
 *                   description: The details of the trip.
 *                 places:
 *                   type: array
 *                   description: An array of places associated with the trip.
 *       404:
 *         description: Not Found. No trip found with the specified ID.
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 *   patch:
 *     summary: Edit trip details
 *     description: Edit the name, start time, and date of a trip associated with the specified trip ID.
 *     parameters:
 *       - name: tripid
 *         in: path
 *         required: true
 *         description: The unique identifier of the trip.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTripName:
 *                 type: string
 *                 description: The new name for the trip.
 *                 example: "Summer Vacation"
 *               newStartTime:
 *                 type: integer
 *                 description: The new start time for the trip (in hours).
 *                 example: 9.25
 *               newDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new date for the trip.
 *                 example: "2024-08-23T08:00:00Z"
 *     responses:
 *       200:
 *         description: Successfully updated the trip details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the update was successful.
 *       404:
 *         description: Not Found. No trip found with the specified ID.
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 */

export async function GET(req: NextRequest) {
  try {
    const tripID = utils.extractID(req.url);
    const data: GetTripData | boolean = await getTripPlaces(tripID);
    if (!data) return NextResponse.json({ status: false }, { status: 404 });
    return NextResponse.json({ status: true, trip: data.trip, places: data.places });
  } catch (error) {
    console.error('Error in GET /api/trip/[tripid]/route:', error);
    return NextResponse.json({ status: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tripID = utils.extractID(req.url);
    const { newTripName, newStartTime, newDate }: { newTripName: string; newStartTime: string; newDate: Date } = await req.json();

    const editData: EditTripData = { tripID, newTripName, newStartTime, newDate };
    const success = await editTrip(editData);

    if (success) {
      return NextResponse.json({ status: true }, { status: 200 });
    } else {
      return NextResponse.json({ status: false }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in PATCH /api/trip/[tripid]/route:', error);
    return NextResponse.json({ status: false }, { status: 500 });
  }
}
