import { Actor } from "./actor";
import { Vector } from "./vector";

export class Obstacle {
    constructor(public pos: Vector, public size: Vector, public ctx: CanvasRenderingContext2D) {}

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    isColliding(actor: Actor) {
        return (
            actor.pos.x >= this.pos.x &&
            actor.pos.x <= this.pos.x + this.size.x &&
            actor.pos.y >= this.pos.y &&
            actor.pos.y <= this.pos.y + this.size.y
        )

    }
}