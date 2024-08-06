export class UserFilter {
    startTime: number | null;
    date: Date | null;
    maxDistance: number | null;
    numberOfPeople: number | null;
    budget: string | null;
    favouriteCategories: string[] | null;
    latitude: number | null = null;
    longitude: number | null = null;

    constructor(
        startTime: number | null = null,
        date: Date | null = null,
        maxDistance: number | null = null,
        numberOfPeople: number | null = null,
        budget: string | null = null,
        favouriteCategories: string[] | null = null,
        latitude: number | null = null,
        longitude: number | null = null
    ) {
        this.startTime = startTime;
        this.date = date;
        this.maxDistance = maxDistance;
        this.numberOfPeople = numberOfPeople;
        this.budget = budget;
        this.favouriteCategories = favouriteCategories;
        this.latitude = latitude;
        this.longitude = longitude;
        if (startTime == null) {
            const currentDate: Date = new Date();
            this.startTime = currentDate.getHours();
        }
        if (date == null) {
            this.date = new Date();
        }
    }

    setStartTime(startTime: number) {
        this.startTime = startTime;
    }

    setDate(date: Date) {
        this.date = date;
    }

    setMaxDistance(maxDistance: number) {
        this.maxDistance = maxDistance;
    }

    setNumberOfPeople(numberOfPeople: number) {
        this.numberOfPeople = numberOfPeople;
    }

    setFavouriteCategories(favouriteCategories: string[]) {
        this.favouriteCategories = favouriteCategories;
    }

    setBudget(budget: string) {
        this.budget = budget;
    }
}
