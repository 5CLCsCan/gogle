import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';
import { RankingSystem } from '@/lib/backend/recommendation/category/rankingSystem';
import { connectDB, findData } from '@/lib/database';
import TripModel, { ITrip } from '@/models/TripSchema';

export class RecommendationSystem {
    userState: UserState;
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

    async initRecommendationSystem(tripID: string) {
        try {
            await connectDB();
            const trips: ITrip[] | null = await findData(TripModel, { _id: tripID });
            if (!trips || trips.length === 0) {
                console.log("Trip not found");
                return;
            }
            const trip = trips[0];
            this.userState = trip.userState;
            this.chosenPlace = trip.locations;
            this.filter = trip.userFilter;
        }
        catch (err) {
            console.error("Error initializing recommendation system:", err);
        }
    }

    getTop5Recommendation() {
        this.rankingSystem.resetScore();
        this.userState.resetState(this.chosenPlace);
        this.recommend();
        return this.rankingSystem.categoryPoints;
    }
}

const recommendationSystem = new RecommendationSystem();

export { recommendationSystem };
export default recommendationSystem;
