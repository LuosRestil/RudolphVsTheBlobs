import { Vec2 } from "bz-game-utils";

export class Splat {
  pos: Vec2;
  fillColor: string;
  strokeColor: string;
  particles: SplatParticle[] = [];
  particleSpeed = 300;
  isActive: boolean = true;
  lifetime: number = 0.25;
  elapsed: number = 0;

  constructor(pos: Vec2, fillColor: string, strokeColor: string) {
    this.pos = pos;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const vel = Vec2.fromAngle(angle, this.particleSpeed);
      this.particles.push(
        new SplatParticle(this.pos.copy(), vel, fillColor, strokeColor)
      );
    }
  }

  update(dts: number) {
    for (let particle of this.particles) {
      particle.update(dts);
    }
    this.elapsed += dts;
    if (this.elapsed > this.lifetime) this.isActive = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let particle of this.particles) {
      particle.draw(ctx);
    }
  }
}

class SplatParticle {
  pos: Vec2;
  vel: Vec2;
  fillColor: string;
  strokeColor: string;

  constructor(pos: Vec2, vel: Vec2, fillColor: string, strokeColor: string) {
    this.pos = pos;
    this.vel = vel;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  update(dts: number): void {
    this.pos.add(Vec2.scale(this.vel, dts));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
