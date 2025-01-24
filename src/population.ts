import { Actor } from "./actor";
import { Obstacle } from "./obstacle";
import { Vector } from "./vector";

export class Population {
    actors: Actor[] = [];
    fitnessSum: number = 0;
    gen: number = 1;
    bestActorIndex: number = 0;
    minStep: number = 1000;

    constructor(size: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, goal: Vector) {
        for (let i = 0; i < size; i++) {
            this.actors.push(new Actor(canvas, ctx, goal));
        }
    }

    show(): void {
        this.actors.forEach(actor => actor.show());
    }

    update(map: Obstacle[]): void {
        this.actors.forEach(actor => {
            if (actor.logic.step > this.minStep) {
                actor.dead = true;
            }
            else {
                actor.update(map);
            }
        });
    }

    calculateFitness(): void {
        this.actors.forEach(actor => actor.calculateFitness());
    }

    allDead(): boolean {
        return this.actors.every(actor => actor.dead || actor.reachedGoal);
    }

    naturalSelection(): void {
        const newActors = [this.actors[this.bestActorIndex].createChild()];
        newActors[0].isBest = true;
        this.calculateFitnessSum();

        for (let i = 1; i < this.actors.length; i++) {
            const parent = this.selectParent();
            newActors.push(parent.createChild());
        }

        this.actors = newActors;
        this.gen++;
    }

    calculateFitnessSum(): void {
        this.fitnessSum = this.actors.reduce((sum, actor) => sum + actor.fitness, 0);
    }

    selectParent(): Actor {
        const rand = Math.random() * this.fitnessSum;
        let runningSum = 0;

        for (const actor of this.actors) {
            runningSum += actor.fitness;
            if (runningSum > rand) {
                return actor;
            }
        }
        return this.actors[0];
    }

    mutate(): void {
        this.actors.slice(1).forEach(actor => actor.logic.mutate());
    }

    setBestActor(): void {
        let maxFitness = 0;
        this.actors.forEach((actor, index) => {
            if (actor.fitness > maxFitness) {
                maxFitness = actor.fitness;
                this.bestActorIndex = index;
            }
        });

        if (this.actors[this.bestActorIndex].reachedGoal) {
            this.minStep = this.actors[this.bestActorIndex].logic.step;
        }
    }
}