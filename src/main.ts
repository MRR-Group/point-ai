import { Obstacle } from "./obstacle";
import { Population } from "./population";
import { Vector } from "./vector";

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 800;
canvas.style.background = "#bbb";
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const goal = new Vector(400, 10);
const population = new Population(500, canvas, ctx, goal);
const map = [
  new Obstacle(new Vector(200, 200), new Vector(400, 10), ctx),
  new Obstacle(new Vector(50, 300), new Vector(500, 10), ctx),
  new Obstacle(new Vector(100, 400), new Vector(300, 10), ctx),
  new Obstacle(new Vector(300, 500), new Vector(200, 10), ctx),
  new Obstacle(new Vector(0, 600), new Vector(100, 10), ctx),
];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStar(ctx, goal.x, goal.y, 10, 5, 5);

  for (let obstacle of map) {
    obstacle.draw();
  }

  if (population.allDead()) {
    population.calculateFitness();
    population.naturalSelection();
    population.mutate();
  } else {
    population.update(map);
    population.show();
  }

  requestAnimationFrame(draw);
}

draw();

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, outerRadius: number, innerRadius: number, points: number): void {
  ctx.fillStyle = 'gold'; 
  ctx.beginPath();

  let angle = Math.PI / points;

  ctx.moveTo(x + outerRadius * Math.cos(0), y - outerRadius * Math.sin(0));

  for (let i = 0; i < 2 * points; i++) {
    let radius = (i % 2 === 0) ? outerRadius : innerRadius;
    let newX = x + radius * Math.cos(i * angle);  
    let newY = y - radius * Math.sin(i * angle);  
    ctx.lineTo(newX, newY); 
  }

  ctx.closePath();
  ctx.fill();
}
