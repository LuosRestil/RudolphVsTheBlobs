import { Vec2 } from "bz-game-utils";
import { randRange } from "bz-game-utils";

export class Projectile {
  ctx: CanvasRenderingContext2D;
  pos: Vec2;
  vel: Vec2;
  radius: number = 10;
  rotation: number = 0;
  rotationSpeed: number;
  isActive: boolean = true;

  constructor(ctx: CanvasRenderingContext2D, pos: Vec2, vel: Vec2) {
    this.ctx = ctx;
    this.pos = pos;
    this.vel = vel;
    this.rotationSpeed = randRange(-Math.PI * 2, Math.PI * 2);
  }

  update(dts: number): void {
    this.pos.add(Vec2.scale(this.vel, dts));
    this.rotation += this.rotationSpeed * dts;
    if (
      this.pos.x > this.ctx.canvas.width ||
      this.pos.y > this.ctx.canvas.height ||
      this.pos.x < 0 ||
      this.pos.y < 0
    ) {
      this.isActive = false;
    }
  }

  draw(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = "chocolate";
    ctx.fillStyle = "burlywood";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "saddlebrown";
    ctx.beginPath();
    ctx.arc(2, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-5, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}