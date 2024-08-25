import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';

export async function parseUserState(search_params: URLSearchParams): Promise<UserState> {
    var satiation = 1.5;
    var tiredness = 1.5;
    var thirsty = 1;
    if (search_params.get('satiation'))
    {
        try {
            satiation = parseFloat(search_params.get('satiation')!);
        } catch (error) {
            console.error(error);
        }
    }
    if (search_params.get('tiredness'))
    {
        try {
            tiredness = parseFloat(search_params.get('tiredness')!);
        }
        catch (error) {
            console.error(error);
        }
    }
    if (search_params.get('thirsty'))
    {
        try {
            thirsty = parseFloat(search_params.get('thirsty')!);
        }
        catch (error) {
            console.error(error);
        }
    }
    return new UserState(satiation, tiredness, thirsty);
}

export async function parseChosenPlaces(search_params: URLSearchParams): Promise<string[]> {
    const chosenPlace = search_params.get('chosenPlace');
    return chosenPlace ? JSON.parse(chosenPlace) : [];
}

export async function parseUserFilter(search_params: URLSearchParams): Promise<UserFilter> {
    const filter = new UserFilter();
    if (search_params.get('startTime')) {
        const time = parseInt(search_params.get('startTime')!);
        filter.setStartTime(time);
    }
    if (search_params.get('date')) {
        const time = new Date(search_params.get('date')!);
        filter.setDate(time);
    }
    if (search_params.get('maxDistance')) {
        const distance = parseInt(search_params.get('maxDistance')!);
        filter.setMaxDistance(distance);
    }
    if (search_params.get('numberOfPeople')) {
        const num = parseInt(search_params.get('numberOfPeople')!);
        filter.setNumberOfPeople(num);
    }
    if (search_params.get('favouriteCategories')) {
        const favCategory = search_params.get('favouriteCategories')!;
        const favouriteCategories: string[] = JSON.parse(favCategory);
        filter.setFavouriteCategories(favouriteCategories);
    }
    return filter;
}

export function parseTime(time: string): number {
    const timeArray = time.split(':');
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);
    return Math.round((hours + minutes / 60) * 100) / 100;
}