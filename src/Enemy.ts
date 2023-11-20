import { Vec2 } from "./Vec2";
import { screenWrap } from "./utils";

export class Enemy {
  ctx: CanvasRenderingContext2D;
  radius: number = 75;
  pos: Vec2 = new Vec2(0, 0);
  vel: Vec2;
  minVel: number = 20;
  maxVel: number = 120;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.vel = Vec2.fromAngle(Math.random() * Math.PI * 2).scale(
      Math.random() * (this.maxVel - this.minVel) + this.minVel
    );
  }

  update(dts: number): void {
    this.pos.add(Vec2.scale(this.vel, dts));
    screenWrap(this, this.ctx);
  }

  draw(): void {
    const ctx = this.ctx;
    // body
    ctx.fillStyle = 'limegreen';
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    // left eye white
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(
      this.pos.x - this.radius / 3,
      this.pos.y - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // left eye pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.pos.x - this.radius / 3,
      this.pos.y - this.radius / 3,
      this.radius / 7,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // right eye white
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(
      this.pos.x + this.radius / 3,
      this.pos.y - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // right eye pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.pos.x + this.radius / 3,
      this.pos.y - this.radius / 3,
      this.radius / 7,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // mouth
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(
      this.pos.x,
      this.pos.y + this.radius / 4,
      this.radius / 2,
      this.radius / 3,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
