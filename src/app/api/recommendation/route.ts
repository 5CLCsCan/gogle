import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';
import { NextRequest } from 'next/server';


/**
 * @swagger
 * components:
 *   schemas:
 *     ICategoryPoint:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: The name of the category.
 *         point:
 *           type: number
 *           description: The point value associated with the category.
 */
/**
 * @swagger
 * /api/recommendation:
 *   get:
 *     summary: Get top 5 recommendations for a trip
 *     description: Retrieve the top 5 category recommendations for a given trip ID.
 *     parameters:
 *       - in: query
 *         name: tripID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip for which to get recommendations.
 *     responses:
 *       200:
 *         description: A JSON array of the top 5 category recommendations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICategoryPoint'
 *       400:
 *         description: Missing or invalid tripID parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing tripID
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search_params = new URLSearchParams(url.searchParams);
        var tripID = search_params.get('tripID');
        if (tripID === null) {
            return new Response(JSON.stringify({ error: 'Missing tripID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const top5Recommendations = await recommendationSystem.getTop5Recommendation(tripID);
        return new Response(JSON.stringify(top5Recommendations), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
