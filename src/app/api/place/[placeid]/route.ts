import { NextRequest } from "next/server";
import getPlace, { GetPlaceData } from '@/lib/backend/updateData/getPlace';
import * as utils from '@/lib/backend/utils/utils';
import { jsonHeader } from "@/lib/backend/header/jsonheader";


/**
 * @swagger
 * /api/place/[placeID]:
 *   get:
 *     summary: Get place details
 *     description: Retrieve the details of a specific place by its ID.
 *     parameters:
 *       - in: path
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
        const placeID = utils.extractPlaceID(req.url);
        const data: GetPlaceData = { placeID: placeID as string};
        const fetchedData = await getPlace(data);
        return new Response(JSON.stringify(fetchedData), jsonHeader);
    } catch (error) {
        console.error("Error in GET /api/getPlace:", error);
        return new Response(JSON.stringify({ status: false }));
    }
}