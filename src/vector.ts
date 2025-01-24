
export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromAngle(angle: number): Vector {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    add(vec: Vector): void {
        this.x += vec.x;
        this.y += vec.y;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

    dist(vec: Vector): number {
        return Math.sqrt((this.x - vec.x) ** 2 + (this.y - vec.y) ** 2);
    }

    limit(max: number): void {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag > max) {
            this.x = (this.x / mag) * max;
            this.y = (this.y / mag) * max;
        }
    }
}
