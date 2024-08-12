import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';
import IGetRCMPlaceData from './IGetRCMdata';

export default async function getRecommendCategory(tripData: IGetRCMPlaceData): Promise<string[]> {
    const recommendations = await recommendationSystem.getRecommendations(tripData);
    if (!recommendations) {
        return [];
    }
    let recommendedCategories: string[] = [];
    recommendations.forEach((recommendation) => {
        recommendedCategories.push(recommendation.category);
    });
    return recommendedCategories;
}