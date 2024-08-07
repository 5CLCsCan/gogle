import { NextRequest, NextResponse } from 'next/server';
import getTripPlaces from '@/lib/backend/updateData/getTripInfo';
import * as utils from '@/lib/backend/utils/utils';
import { GetTripData } from '@/lib/backend/updateData/getTripInfo';

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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the trip.
 *                     userID:
 *                       type: string
 *                       description: The ID of the user who created the trip.
 *                     userFilter:
 *                       type: object
 *                       description: The filters applied to the trip.
 *                       properties:
 *                         startTime:
 *                           type: number
 *                           description: The start time of the trip.
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           description: The start date and time of the trip.
 *                         maxDistance:
 *                           type: number
 *                           description: The maximum travel distance for the trip.
 *                         numberOfPeople:
 *                           type: number
 *                           description: The number of people on the trip.
 *                         budget:
 *                           type: string
 *                           description: The budget for the trip.
 *                         favouriteCategories:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Favorite categories for the trip.
 *                     last_latitude:
 *                       type: number
 *                       description: The last known latitude of the trip.
 *                     last_longitude:
 *                       type: number
 *                       description: The last known longitude of the trip.
 *                     locationsID:
 *                       type: array
 *                       description: An array of location IDs associated with the trip.
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation timestamp of the trip.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The last update timestamp of the trip.
 *                     __v:
 *                       type: number
 *                       description: The version key for the trip document.
 *                 places:
 *                   type: array
 *                   description: An array of places associated with the trip.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the place.
 *                       name:
 *                         type: string
 *                         description: The name of the place.
 *                       address:
 *                         type: string
 *                         description: The address of the place.
 *                       latitude:
 *                         type: number
 *                         description: The latitude coordinate of the place.
 *                       longitude:
 *                         type: number
 *                         description: The longitude coordinate of the place.
 *                       imgLink:
 *                         type: string
 *                         description: A URL link to an image of the place.
 *                       openingTime:
 *                         type: array
 *                         description: An array of strings representing opening times.
 *                         items:
 *                           type: string
 *                           description: Opening time of the place in a string format (e.g., "09:00 AM - 10:00 PM").
 *                       price_range:
 *                         type: array
 *                         description: The price range for the place.
 *                         items:
 *                           type: number
 *                         example: [50000, 100000]
 *       404:
 *         description: Not Found. No trip found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates failure.
 *                 message:
 *                   type: string
 *                   description: A message explaining that the trip was not found.
 *                   example: Trip not found
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates failure.
 *                 message:
 *                   type: string
 *                   description: A message detailing the server error.
 */


export async function GET(req: NextRequest) {
  try {
    const tripID = utils.extractID(req.url);
    const data : GetTripData | boolean = await getTripPlaces(tripID);
    if (!data) return NextResponse.json({ status: false }, { status: 404 });
    return NextResponse.json({ status: true, trip: data.trip, places: data.places });
  } catch (error) {
    console.error('Error in GET /api/trip/[tripid]/route:', error);

    return NextResponse.json({ status: false }, { status: 500 });
  }
}
