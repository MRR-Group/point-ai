import { Logic } from "./logic";
import { Obstacle } from "./obstacle";
import { Vector } from "./vector";

export class Actor {
    pos: Vector;
    vel: Vector = new Vector(0, 0);
    acc: Vector = new Vector(0, 0);
    logic: Logic = new Logic(1000);
    dead: boolean = false;
    reachedGoal: boolean = false;
    isBest: boolean = false;
    fitness: number = 0;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected goal: Vector;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, goal: Vector) {
        this.pos = new Vector(canvas.width / 2, canvas.height - 10);
        this.ctx = ctx;
        this.canvas = canvas;
        this.goal = goal;
    }

    show(): void {
        this.ctx.fillStyle = this.isBest ? 'rgba(1.0, 1.0, 0.0, 1.0)' : 'rgba(0.5, 0.5, 0.5, 0.2)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y - (this.isBest ? 10 : 5));
        this.ctx.lineTo(this.pos.x - (this.isBest ? 8 : 4), this.pos.y + (this.isBest ? 8 : 4)); 
        this.ctx.lineTo(this.pos.x + (this.isBest ? 8 : 4), this.pos.y + (this.isBest ? 8 : 4));
        this.ctx.closePath();
        this.ctx.fill();
    }

    move(): void {
        if (this.logic.step < this.logic.directions.length) {
            this.acc = this.logic.directions[this.logic.step];
            this.logic.step++;
        } else {
            this.dead = true;
        }
        this.vel.add(this.acc);
        this.vel.limit(5);
        this.pos.add(this.vel);
    }

    update(map: Obstacle[]): void {
        if (!this.dead && !this.reachedGoal) {
            this.move();

            if (
                this.pos.x < 2 ||
                this.pos.y < 2 ||
                this.pos.x > this.canvas.width - 2 ||
                this.pos.y > this.canvas.height - 2 ||
                this.pos.dist(this.goal) < 5 ||
                (map.some(obstacle => obstacle.isColliding(this)))
            ) {
                this.dead = this.pos.dist(this.goal) >= 5;
                this.reachedGoal = !this.dead;
            }
        }
    }

    calculateFitness(): void {
        if (this.reachedGoal) {
            const min = 1.0 / 16.0;
            const moves = 10000.0 / (this.logic.step ** 2);

            this.fitness = min + moves;
        } else {
            const distanceToGoal = this.pos.dist(this.goal);
            this.fitness = 1.0 / (distanceToGoal ** 2);
        }
    }

    createChild(): Actor {
        const child = new Actor(this.canvas, this.ctx, this.goal);
        child.logic = this.logic.clone();

        return child;
    }
}