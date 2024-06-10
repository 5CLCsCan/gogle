import { HumanStatus, getMainCategory, categoryEvaluate } from '@/lib/backend/recommendation/category/utils';

export class UserState {
    satiation: number;
    tiredness: number;
    thirsty: number;
    maxSatiation: number;
    maxTiredness: number;
    maxThirsty: number;

    constructor(maxSatiation: number = 1.5, maxTiredness: number = 1.5, maxThirsty: number = 1) {
        this.satiation = 0;
        this.tiredness = 0;
        this.thirsty = 0;
        this.maxSatiation = maxSatiation;
        this.maxTiredness = maxTiredness;
        this.maxThirsty = maxThirsty;
    }

    getLowestStateIndex(): number {
        const arr = [this.satiation, this.tiredness, this.thirsty];
        return arr.indexOf(Math.min(...arr));
    }

    resetState(chosenPlace: string[] | null) {
        if (chosenPlace === null || chosenPlace.length === 0) {
            this.satiation = 0;
            this.tiredness = 0;
            this.thirsty = 0;
        } else {
            for (let i = 0; i < chosenPlace.length; i++) {
                const mainCategory = getMainCategory[chosenPlace[i]];
                const point: HumanStatus = categoryEvaluate[mainCategory];
                if (point === undefined) {
                    console.log(`Error at ${chosenPlace[i]}: is not in categoryEvaluate`);
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
}
