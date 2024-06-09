import recommendationSystem, { RecommendationSystem } from '@/lib/backend/recommendation/category/recommendationSystem';
import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search_params = new URLSearchParams(url.searchParams);


        const userSatiation = search_params.get('satiation');
        const userTiredness = search_params.get('tiredness');
        const userThirsty = search_params.get('thirsty');
        const userState = new UserState();
        if (userSatiation) {
            const satiation = parseFloat(userSatiation);
            userState.satiation = satiation;
        }
        if (userTiredness) {
            const tiredness = parseFloat(userTiredness);
            userState.tiredness = tiredness;
        }
        if (userThirsty) {
            const thirsty = parseFloat(userThirsty);
            userState.thirsty = thirsty;
        }



        const chosenPlace = search_params.get('chosenPlace');
        var places: string[] = [];
        if (chosenPlace) {
            places = JSON.parse(chosenPlace);
        }


        const startTime = search_params.get('startTime');
        const date = search_params.get('date');
        const maxDistance = search_params.get('maxDistance');
        const numberOfPeople = search_params.get('numberOfPeople');
        const favCategory = search_params.get('favouriteCategories');
        var favouriteCategories: string[] = [];
        if (favCategory) {
            favouriteCategories = JSON.parse(favCategory);
        }
        const filter = new UserFilter();
        if (startTime) {
            const time = parseInt(startTime);
            filter.setStartTime(time);
        }
        if (date) {
            const time = new Date(date);
            filter.setDate(time);
        }
        if (maxDistance) {
            const distance = parseInt(maxDistance);
            filter.setMaxDistance(distance);
        }
        if (numberOfPeople) {
            const num = parseInt(numberOfPeople);
            filter.setNumberOfPeople(num);
        }
        if (favouriteCategories) {
            filter.setFavouriteCategories(favouriteCategories);
        }


        recommendationSystem.setUserState(userState);
        recommendationSystem.setChosenPlace(places);
        recommendationSystem.setFilter(filter);
        const top5Recommendations = recommendationSystem.getTop5Recommendation();
        return new Response(JSON.stringify(top5Recommendations));
    }
    catch (error) {
        return JSON.stringify(error);
    }
}