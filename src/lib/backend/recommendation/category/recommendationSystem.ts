import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { RankingSystem } from '@/lib/backend/recommendation/category/rankingSystem';

export class RecommendationSystem {
    userState: UserState | null;
    chosenPlace: string[] | null;
    filter: UserFilter | null;
    rankingSystem: RankingSystem;

    constructor(userState: UserState = new UserState(), chosenPlace: string[] = [], filter: UserFilter = new UserFilter()) {
        this.userState = userState;
        this.chosenPlace = chosenPlace;
        this.filter = filter;
        this.rankingSystem = new RankingSystem();
    }

    recommend() {
        if (this.userState) {
            this.rankingSystem.rankingUserState(this.userState);
        }
        if (this.filter) {
            this.rankingSystem.rankingUserFilter(this.filter);
        }
        if (this.chosenPlace) {
            this.rankingSystem.rankingChosenPlaces(this.chosenPlace);
        }
        this.rankingSystem.categoryPoints.sort((a, b) => b.point - a.point);
        return this.rankingSystem.categoryPoints;
    }

    setFilter(filter: UserFilter) {
        this.filter = filter;
    }

    setUserState(userState: UserState) {
        this.userState = userState;
    }

    setChosenPlace(chosenPlace: string[]) {
        this.chosenPlace = chosenPlace;
    }

    getTop5Recommendation() {
        this.rankingSystem.resetScore();
        this.userState?.resetState(this.chosenPlace);
        this.recommend();
        return this.rankingSystem.categoryPoints.slice(0, 5);
    }
}

const recommendationSystem = new RecommendationSystem();

export { recommendationSystem };
export default recommendationSystem;
