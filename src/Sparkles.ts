import { Vec2 } from "bz-game-utils";
import { randRange } from "bz-game-utils";

class SparkleParticle {
  static readonly size: number = 5;
  static readonly colors: string[] = [
    "cyan",
    "magenta",
    "yellow",
    "lime",
    "red",
    "orange",
  ];

  pos: Vec2;
  vel: Vec2;
  lifespan: number; // seconds
  isActive: boolean = true;
  elapsed: number = 0;
  color: string;
  

  constructor(pos: Vec2, vel: Vec2) {
    this.pos = pos;
    this.vel = vel;
    this.lifespan = randRange(0.3, 0.5);
    const randIdx = Math.floor(Math.random() * SparkleParticle.colors.length);
    this.color = SparkleParticle.colors[randIdx];
  }

  update(dts: number): void {
    this.pos.add(Vec2.scale(this.vel, dts));

    this.elapsed += dts;
    if (this.elapsed > this.lifespan) {
      this.isActive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos.x - SparkleParticle.size / 2,
      this.pos.y - SparkleParticle.size / 2,
      SparkleParticle.size,
      SparkleParticle.size
    );
  }
}

export class Sparkles {
  static angleVariance: number = Math.PI / 6;
  static particleSpeed: number = 200;

  particles: SparkleParticle[] = [];
  spawnRate: number = 5 / 1000; // 5 ms
  lastSpawnTime: number = 0;
  elapsed: number = 0;
  isActive: boolean = false;
  
  constructor() {}

  update(dts: number, pos: Vec2, playerAngle: number): void {
    this.elapsed += dts;
    
    const delta = this.elapsed - this.lastSpawnTime;
    if (delta > this.spawnRate && this.isActive) {
      this.spawnParticle(pos, playerAngle);
      this.lastSpawnTime = this.elapsed - (this.elapsed % this.spawnRate);
    }

    this.particles = this.particles.filter(particle => particle.isActive);
    for (let particle of this.particles) {
      particle.update(dts);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let particle of this.particles) {
      particle.draw(ctx);
    }
  }

  private spawnParticle(pos: Vec2, playerAngle: number): void {
    const minAngle = playerAngle - Sparkles.angleVariance;
    const maxAngle = playerAngle + Sparkles.angleVariance;
    const angle = randRange(minAngle, maxAngle);
    this.particles.push(
      new SparkleParticle(
        pos.copy(),
        Vec2.fromAngle(angle, -Sparkles.particleSpeed)
      )
    );
  }
}
