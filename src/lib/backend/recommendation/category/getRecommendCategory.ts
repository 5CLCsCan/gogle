import recommendationSystem from '@/lib/backend/recommendation/category/recommendationSystem';

export default async function getRecommendCategory(tripID: string) {
    const recommendations = await recommendationSystem.getRecommendations(tripID);

    if (!recommendations) {
        return [];
    }

    return recommendations;
}