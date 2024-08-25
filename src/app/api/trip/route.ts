import { NextRequest } from 'next/server'
import createTrip, { CreateTripData } from '@/lib/backend/updateData/createTrip'
import removeTrip, { RemoveTripData } from '@/lib/backend/updateData/removeTrip'
import getTrips from '@/lib/backend/updateData/getTrips'
import fetchUserIDByToken from '@/lib/backend/updateData/getUserID'
import { parseTime } from '@/lib/backend/recommendation/category/parser'

const database = require('@/lib/backend/database')

/**
 * @swagger
 * /api/trip:
 *   get:
 *     summary: Get all trips of a user
 *     description: Retrieve all trips for a user identified by the provided token.
 *     parameters:
 *       - name: decoded
 *         in: header
 *         required: true
 *         description: The decoded authentication token to identify the user.
 *         schema:
 *           type: string
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
 *                     description: The ID of the user who created the trip.
 *                   tripName:
 *                     type: string
 *                     description: The name of the trip.
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
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "Missing or invalid authentication token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "Internal server error."
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('decoded')
    if (!token) {
      return new Response(JSON.stringify({ status: false }))
    }
    const userID = await fetchUserIDByToken(token)
    if (!userID) {
      return new Response(JSON.stringify({ status: false }))
    }
    const trips = await getTrips(userID)
    return new Response(JSON.stringify(trips))
  } catch (error) {
    console.error('Error in GET /api/trip:', error)
    return new Response(JSON.stringify([]))
  }
}

/**
 * @swagger
 * /api/trip:
 *   post:
 *     summary: Create a new trip
 *     description: Create a new trip with the provided trip details.
 *     parameters:

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the trip.
 *               startTime:
 *                 type: number
 *                 description: The start time of the trip in a specific format (e.g., epoch time).
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
 *         description: Successful response with the created trip data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the trip was created successfully.
 *                 data:
 *                   type: object
 *                   description: The trip data if creation was successful.
 *                   properties:
 *                     userID:
 *                       type: string
 *                       description: The ID of the user who created the trip.
 *                     tripName:
 *                       type: string
 *                       description: The name of the trip.
 *                     locationsID:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: An array of location IDs associated with the trip.
 *                     userState:
 *                       type: object
 *                       description: The state of the user during the trip.
 *                       properties:
 *                         maxSatiation:
 *                           type: number
 *                           description: The maximum satiation level of the user.
 *                         maxTiredness:
 *                           type: number
 *                           description: The maximum tiredness level of the user.
 *                         maxThirsty:
 *                           type: number
 *                           description: The maximum thirst level of the user.
 *                         satiation:
 *                           type: number
 *                           description: The current satiation level of the user.
 *                         tiredness:
 *                           type: number
 *                           description: The current tiredness level of the user.
 *                         thirsty:
 *                           type: number
 *                           description: The current thirst level of the user.
 *                     userFilter:
 *                       type: object
 *                       description: The filters applied to the trip.
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           description: The latitude of the starting location.
 *                         longitude:
 *                           type: number
 *                           description: The longitude of the starting location.
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
 *                     _id:
 *                       type: string
 *                       description: The unique identifier for the created trip.
 *       400:
 *         description: Bad Request. The request body is invalid or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates failure.
 *                   example: false
 *       500:
 *         description: Internal server error. An unexpected error occurred on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates failure.
 *                   example: false
 */

export async function POST(req: NextRequest) {
  try {
    const parseData = await req.json()
    const token = req.headers.get('decoded')
    if (!token) {
      return new Response(JSON.stringify({ status: false }))
    }
    const userID = await fetchUserIDByToken(token)
    if (!userID) {
      return new Response(JSON.stringify({ status: false }))
    }
    const data: CreateTripData = {
      userID: userID,
      tripName: parseData.tripName,
      startDate: parseData.startDate,
      startTime: parseTime(parseData.startTime),
      tripLength: parseData.tripLength,
      numberOfPeople: parseData.numberOfPeople,
      budget: parseData.budget,
      favouriteCategories: parseData.favouriteCategories,
      latitude: parseData.latitude,
      longitude: parseData.longitude,
    }
    console.log(data)
    const respone = await createTrip(data)
    return new Response(JSON.stringify({ status: true, data: respone }))
  } catch (error) {
    console.error('Error in POST /api/createTrip:', error)
    return new Response(JSON.stringify({ status: false }))
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
 *                   example: true
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
export async function DELETE(req: NextRequest) {
  try {
    const parseData = await req.json()
    const data: RemoveTripData = {
      tripID: parseData.tripID,
    }
    const status = await removeTrip(data)
    return new Response(JSON.stringify({ status: status }))
  } catch (error) {
    console.error('Error in POST /api/removeTrip:', error)
    return new Response(JSON.stringify({ status: false }))
  }
}
