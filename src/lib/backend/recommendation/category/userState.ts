import { HumanEffectEvaluation, getMainCategory, categoryEvaluate } from '@/lib/backend/recommendation/category/utils';

export class UserState {
    satiation: number;
    tiredness: number;
    thirsty: number;
    maxSatiation: number;
    maxTiredness: number;
    maxThirsty: number;

    constructor(satiation: number = 0, tiredness: number = 0, thirsty: number = 0) {
        this.maxSatiation = 1.5;
        this.maxTiredness = 1.5;
        this.maxThirsty = 1;
        this.satiation = satiation;
        this.tiredness = tiredness;
        this.thirsty = thirsty;
    }

    getLowestStateIndex(): number {
        const arr = [this.satiation, this.tiredness, this.thirsty];
        return arr.indexOf(Math.min(...arr));
    }

    resetState(chosenPlace: string[]) {
        if (chosenPlace.length === 0) {
            this.satiation = 0;
            this.tiredness = 0;
            this.thirsty = 0;
        } else {
            try {
                const chosenCategory = chosenPlace;
                for (let i = 0; i < chosenCategory.length; i++) {
                    const mainCategory = getMainCategory[chosenCategory[i]];
                    const point: HumanEffectEvaluation = categoryEvaluate[mainCategory];
                    if (point === undefined) {
                        console.log(`Error at ${chosenCategory[i]}: is not in categoryEvaluate`);
                        return;
                    }
                    this.satiation += point.satiation;
                    this.tiredness += point.tiredness;
                    this.thirsty += point.thirsty;
                }
                this.satiation = Math.min(this.maxSatiation, Math.max(0, this.satiation));
                this.tiredness = Math.min(this.maxTiredness, Math.max(0, this.tiredness));
                this.thirsty = Math.min(this.maxThirsty, Math.max(0, this.thirsty));
            } 
            catch (err) {
                console.error("Error resetState:", err);
            }
        }
    }

    setState(satiation: number, tiredness: number, thirsty: number) {
        this.satiation = satiation;
        this.tiredness = tiredness;
        this.thirsty = thirsty;
    }

    setMaxState(maxSatiation: number, maxTiredness: number, maxThirsty: number) {
        this.maxSatiation = maxSatiation;
        this.maxTiredness = maxTiredness;
        this.maxThirsty = maxThirsty;
    }

    setUserState(userState: UserState) {
        this.satiation = userState.satiation;
        this.tiredness = userState.tiredness;
        this.thirsty = userState.thirsty;
    }
}
