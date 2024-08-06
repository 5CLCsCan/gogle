import { recommendationSystem } from '@/lib/backend/recommendation/category/recommendationSystem';
import { ITrip } from '@/models/TripSchema';

export default async function getRecommendCategory(tripID: string | ITrip) {
    const recommendations = await recommendationSystem.getRecommendations(tripID);
    if (!recommendations) {
        return [];
    }
    let recommendedCategories: string[] = [];
    recommendations.forEach((recommendation: { category: string; }) => {
        recommendedCategories.push(recommendation.category);
    });
    return recommendedCategories;
}