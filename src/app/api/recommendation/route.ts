import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';
import { NextRequest } from 'next/server';
import { parseUserState, parseChosenPlaces, parseUserFilter } from '@/lib/backend/recommendation/category/parser';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search_params = new URLSearchParams(url.searchParams);

        const userState = await parseUserState(search_params)
        const chosenPlace = await parseChosenPlaces(search_params);
        const filter = await parseUserFilter(search_params);

        recommendationSystem.setUserState(userState);
        recommendationSystem.setChosenPlace(chosenPlace);
        recommendationSystem.setFilter(filter);

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
