import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import {
  circleCircleCollisionDetected,
  obbCircleCollisionDetected,
} from "./utils";

export class Game {
  ctx: CanvasRenderingContext2D;
  lastTime: number = 0;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[] = [];
  bgcolor: string = "black";

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(ctx, this);
    this.enemies = this.spawnEnemies();
  }

  start(): void {
    requestAnimationFrame(this.loop);
  }

  private loop = (ms: number): void => {
    requestAnimationFrame(this.loop);

    const dt = ms - this.lastTime;
    const dts = dt / 1000;
    this.lastTime = ms;

    this.projectiles = this.projectiles.filter(
      (projectile) => projectile.isActive
    );
    this.enemies = this.enemies.filter((enemy) => enemy.isActive);
    this.draw();
    this.update(dts);
    this.detectCollisions();
  };

  private update(dts: number): void {
    this.player.update(dts);
    for (let enemy of this.enemies) {
      enemy.update(dts);
    }
    for (let projectile of this.projectiles) {
      projectile.update(dts);
    }
  }

  private detectCollisions(): void {
    for (let projectile of this.projectiles) {
      for (let enemy of this.enemies) {
        if (circleCircleCollisionDetected(projectile, enemy)) {
          enemy.isActive = false;
          projectile.isActive = false;
        }
      }
    }

    let collisionDetected = false;
    for (let enemy of this.enemies) {
      if (obbCircleCollisionDetected(this.player, enemy)) {
        collisionDetected = true;
        break;
      }
    }
    if (collisionDetected) {
      this.bgcolor = "red";
      // TODO destroy player, handle game over
    } else {
      this.bgcolor = "black";
    }
  }

  private draw(): void {
    this.ctx.fillStyle = this.bgcolor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let enemy of this.enemies) {
      enemy.draw();
    }
    for (let projectile of this.projectiles) {
      projectile.draw();
    }
    this.player.draw();
  }

  private spawnEnemies(): Enemy[] {
    let enemies = [];
    for (let i = 0; i < 3; i++) {
      enemies.push(new Enemy(this.ctx));
    }
    return enemies;
  }
}
