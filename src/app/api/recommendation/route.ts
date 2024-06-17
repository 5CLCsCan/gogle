import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';
import { NextRequest } from 'next/server';
/**
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
