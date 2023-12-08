import { Vec2 } from "./Vec2";
import { randRange, screenWrap } from "./utils";

export class Enemy {
  ctx: CanvasRenderingContext2D;
  baseSize: number = 75;
  radius: number;
  pos: Vec2 = new Vec2(0, 0);
  vel: Vec2;
  minVel: number = 20;
  maxVel: number = 120;
  isActive: boolean = true;
  stage: number;
  scale: number;
  requiredHits: number;
  colors = {
    fill: ["limegreen", "violet", "crimson"],
    stroke: ["green", "rebeccapurple", "firebrick"],
  };
  dingSound: HTMLAudioElement = new Audio("ding.ogg");
  popSound: HTMLAudioElement = new Audio("pop.mp3");
  splatSound: HTMLAudioElement = new Audio("splat.wav");

  constructor(
    ctx: CanvasRenderingContext2D,
    origin: Vec2,
    stage: number,
    scale: number
  ) {
    this.ctx = ctx;
    this.pos = origin;
    this.stage = stage;
    this.scale = scale;
    this.radius = this.baseSize * scale;
    this.vel = Vec2.fromAngle(Math.random() * Math.PI * 2).scale(
      randRange(this.minVel, this.maxVel)
    );
    const rand = Math.random();
    if (rand > 0.2) this.requiredHits = 1;
    else if (rand > 0.05) this.requiredHits = 2;
    else this.requiredHits = 3;

    this.dingSound.preload = "auto";
    this.popSound.preload = "auto";
    this.splatSound.preload = "auto";
  }

  update(dts: number): void {
    this.pos.add(Vec2.scale(this.vel, dts));
    screenWrap(this, this.ctx);
  }

  draw(): void {
    const ctx = this.ctx;
    // body
    ctx.fillStyle = this.colors.fill[this.requiredHits - 1];
    ctx.strokeStyle = this.colors.stroke[this.requiredHits - 1];
    ctx.lineWidth = 3 * this.scale;
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

  ding(): void {
    if (!this.dingSound.paused) {
      this.dingSound.currentTime = 0; // Restart the sound if it is playing
    }
    this.dingSound.play();
  }

  pop(): void {
    this.popSound.play();
  }

  splat(): void {
    this.splatSound.play();
  }
}
