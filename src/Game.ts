import { Enemy } from "./Enemy";
import { Player } from "./Player";

export class Game {
  ctx: CanvasRenderingContext2D;
  lastTime: number = 0;
  player: Player;
  enemies: Enemy[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(ctx);
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

    this.update(dts);
    this.draw();
  }

  private update(dts: number): void {
    this.player.update(dts);
    for (let enemy of this.enemies) {
      enemy.update(dts);
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.player.draw();
    for (let enemy of this.enemies) {
      enemy.draw();
    }
  }

  private spawnEnemies() {
    let enemies = [];
    for (let i = 0; i < 3; i++) {
      enemies.push(new Enemy(this.ctx));
    }
    return enemies;
  }
}
