import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { RankingSystem } from '@/lib/backend/recommendation/category/rankingSystem';
import { findData } from '@/lib/database';
import TripModel, { ITrip } from '@/models/TripSchema';

export class RecommendationSystem {
    userState: UserState;
    chosenPlace: string[];
    filter: UserFilter;
    rankingSystem: RankingSystem;

    constructor() {
        this.userState = new UserState();
        this.chosenPlace = [];
        this.filter = new UserFilter();
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
        this.userState?.setState(userState.satiation, userState.tiredness, userState.thirsty);
    }

    setChosenPlace(chosenPlace: string[]) {
        this.chosenPlace = chosenPlace;
    }

    async initRecommendationSystem(tripID: string) {
        try {
            const trips: ITrip[] | null = await findData(TripModel, { _id: tripID });
            if (!trips || trips.length === 0) {
                console.log("Trip not found");
                return;
            }
            const trip = trips[0];
            if (trip.locations) this.setChosenPlace(trip.locations);
            if (trip.userState) this.setUserState(trip.userState);
            if (trip.userFilter) this.setFilter(trip.userFilter);
        }
        catch (err) {
            console.error("Error initializing recommendation system:", err);
        }
    }

    async getTop5Recommendation(tripID: string) {
        await this.initRecommendationSystem(tripID);
        this.rankingSystem.resetScore();
        console.log("chosen place: ", this.chosenPlace);
        this.userState.resetState(this.chosenPlace ? this.chosenPlace : []);
        this.recommend();
        return this.rankingSystem.categoryPoints;
    }
}

const recommendationSystem = new RecommendationSystem();

export { recommendationSystem };
export default recommendationSystem;
