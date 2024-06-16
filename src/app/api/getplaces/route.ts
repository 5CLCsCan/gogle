import { NextRequest } from "next/server";
import { getPlaces } from "@/lib/backend/recommendation/places/getPlaces";
import { jsonHeader } from "@/lib/backend/header/jsonheader";

/**
*   @swagger
*   /api/getplaces:
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
*                     placeID:
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
*                       type: string
*                     closingTime:
*                       type: string
*                     price_range:
*                       type: array
*                       items:
*                         type: number
*                       example: [50000, 100000]
*/



export async function GET(req: NextRequest) {
    const data = req.headers.get("decoded");
    let places = await getPlaces({ lat: 10.773856, long: 106.704809, radius: 4, category_list: ['food/sang-trong', 'travel/bao-tang-di-tich']})
    return new Response(JSON.stringify(places), jsonHeader);
}


