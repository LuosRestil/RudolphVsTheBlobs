import { Vec2 } from "./Vec2";
import { randRange } from "./utils";

export enum PowerupType {
  TripleShot,
  FastCookies,
  BlobPiercing,
  Shield,
  UnlimitedCannon,
}

export class Powerup {
  pos: Vec2;
  type: PowerupType;
  vel: Vec2;
  minVel: number = 20;
  maxVel: number = 120;
  radius: number = 20;
  isActive: boolean = true;

  static colors = {
    [PowerupType.TripleShot]: "dodgerblue",
    [PowerupType.BlobPiercing]: "crimson",
    [PowerupType.FastCookies]: "darkgreen",
    [PowerupType.Shield]: "darkorchid",
    [PowerupType.UnlimitedCannon]: "maroon",
  }

  static labels = {
    [PowerupType.TripleShot]: "TS",
    [PowerupType.BlobPiercing]: "BP",
    [PowerupType.FastCookies]: "FC",
    [PowerupType.Shield]: "S",
    [PowerupType.UnlimitedCannon]: "UC",
  }

  constructor(pos: Vec2, type: PowerupType) {
    this.pos = pos;
    this.type = type;
    this.vel = Vec2.fromAngle(Math.random() * Math.PI * 2).scale(
      randRange(this.minVel, this.maxVel)
    );
  }

  update(dts: number, ctx: CanvasRenderingContext2D): void {
    this.pos.add(Vec2.scale(this.vel, dts));
    if (
      this.pos.x > ctx.canvas.width ||
      this.pos.y > ctx.canvas.height ||
      this.pos.x < 0 ||
      this.pos.y < 0
    ) {
      this.isActive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Powerup.colors[this.type];
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Powerup.labels[this.type], this.pos.x, this.pos.y);

  }
}
