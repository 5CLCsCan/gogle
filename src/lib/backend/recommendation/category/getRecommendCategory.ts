import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';

export async function getRecommendCategory(tripID: string): Promise<string[]> {
    const recommendations = await recommendationSystem.getRecommendations(tripID);
    if (!recommendations) {
        return [];
    }
    let recommendedCategories: string[] = [];
    recommendations.forEach((recommendation) => {
        recommendedCategories.push(recommendation.category);
    });
    return recommendedCategories;
}