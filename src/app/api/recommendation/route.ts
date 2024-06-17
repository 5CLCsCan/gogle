import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';
import { NextRequest } from 'next/server';
import { parseUserState, parseChosenPlaces, parseUserFilter } from '@/lib/backend/recommendation/category/parser';

/**
 * @param req 
 * req.query: {
 *      satiation: number,
 *      tiredness: number,
 *      thirsty: number,
 *      chosenPlace: string[],
 *      startTime: number,
 *      date: string,
 *      maxDistance: number,
 *      numberOfPeople: number,
 *      favouriteCategories: string[]
 * }
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
        recommendationSystem.initRecommendationSystem(tripID);

        const top5Recommendations = recommendationSystem.getTop5Recommendation();
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
