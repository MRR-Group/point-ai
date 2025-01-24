import { Vector } from "./vector";

export class Logic {
    directions: Vector[];
    step: number = 0;

    constructor(size: number) {
        this.directions = new Array(size).fill(null).map(() => Vector.fromAngle(Math.random() * 2 * Math.PI));
    }

    clone(): Logic {
        const clone = new Logic(this.directions.length);
        clone.directions = this.directions.map(dir => dir.copy());
        return clone;
    }

    mutate(): void {
        const mutationRate = 0.01;
        this.directions = this.directions.map(dir => (Math.random() < mutationRate ? Vector.fromAngle(Math.random() * 2 * Math.PI) : dir));
    }
}