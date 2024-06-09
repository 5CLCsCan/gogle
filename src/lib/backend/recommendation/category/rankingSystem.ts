// import { ICategoryPoint } from './ICategoryPoint';
// import { UserState } from './UserState';
// import { UserFilter } from './UserFilter';
// import { Ultils, placeCategory, getMainCategory, categoryEvaluate, timePeriods } from './Ultils';
import { ICategoryPoint } from '@/lib/backend/recommendation/category/ICategoryPoint';
import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { Ultils, placeCategory, getMainCategory, categoryEvaluate, timePeriods, HumanStatus } from '@/lib/backend/recommendation/category/utils';

export class RankingSystem {
    categoryPoints: ICategoryPoint[];

    constructor() {
        this.categoryPoints = [];
        this.resetScore();
    }

    resetScore() {
        this.categoryPoints = [];
        for (let i = 0; i < placeCategory.length; i++) {
            this.categoryPoints.push(new ICategoryPoint(placeCategory[i], 50));
        }
    }

    rankingUserState(userState: UserState) {
        console.log(`${userState.satiation} ${userState.thirsty} ${userState.tiredness}`);
        for (let i = 0; i < this.categoryPoints.length; i++) {
            const temp = this.categoryPoints[i].category;
            const mainCategory = getMainCategory[temp];
            const point: HumanStatus = categoryEvaluate[mainCategory];
            if (userState.satiation + point.satiation > userState.maxSatiation) {
                this.categoryPoints[i].point -= 10;
                console.log(`${this.categoryPoints[i].category} -> ${this.categoryPoints[i].point} : satiation is too high`);
            }
            if (userState.tiredness + point.tiredness > userState.maxTiredness) {
                this.categoryPoints[i].point -= 10;
                console.log(`${this.categoryPoints[i].category} -> ${this.categoryPoints[i].point} : tiredness is too high`);
            }
            if (userState.thirsty + point.thirsty > userState.maxThirsty) {
                this.categoryPoints[i].point -= 10;
                console.log(`${this.categoryPoints[i].category} -> ${this.categoryPoints[i].point} : thirsty is too high`);
            }
        }
    }

    rankingUserFilter(userFilter: UserFilter) {
        if (userFilter.startTime) this.rankingTime(userFilter.startTime);
        if (userFilter.maxDistance) this.rankingDistance(userFilter.maxDistance);
        if (userFilter.numberOfPeople) this.rankingPeople(userFilter.numberOfPeople);
        if (userFilter.favouriteCategories) this.rankingCategories(userFilter.favouriteCategories);
    }

    rankingChosenPlaces(chosenPlace: string[]) {
        for (let i = 0; i < chosenPlace.length; i++) {
            let index = -1;
            for (let j = 0; j < this.categoryPoints.length; j++) {
                if (this.categoryPoints[j].category === chosenPlace[i]) {
                    index = j;
                    break;
                }
            }
            if (index !== -1) {
                this.categoryPoints[index].point -= 20;
                console.log(`${this.categoryPoints[index].category} -> ${this.categoryPoints[index].point} : chosen place`);
            }
        }
    }

    rankingTime(time: number) {
        const currentTimePeriod = Ultils.getCurrentTimePeriod();
        console.log(`current time: ${currentTimePeriod}`);
        for (let i = 0; i < timePeriods[currentTimePeriod].length; i++) {
            let index = -1;
            for (let j = 0; j < this.categoryPoints.length; j++) {
                if (this.categoryPoints[j].category === timePeriods[currentTimePeriod][i]) {
                    index = j;
                    break;
                }
            }
            if (index !== -1) {
                this.categoryPoints[index].point -= 10;
                console.log(`${this.categoryPoints[index].category} -> ${this.categoryPoints[index].point} : time period`);
            }
        }
    }

    rankingDistance(distance: number) {
        // Implement logic for ranking based on distance
    }

    rankingPeople(numberOfPeople: number) {
        // Implement logic for ranking based on the number of people
    }

    rankingCategories(favouriteCategories: string[]) {
        for (let i = 0; i < this.categoryPoints.length; i++) {
            let isIncluded = false;
            for (let j = 0; j < favouriteCategories.length; j++) {
                if (favouriteCategories[j] === this.categoryPoints[i].category) {
                    isIncluded = true;
                    break;
                }
            }
            if (isIncluded) {
                this.categoryPoints[i].point += 5;
                console.log(`${this.categoryPoints[i].category} -> ${this.categoryPoints[i].point} : favourite categories`);
            }
        }
    }
}
