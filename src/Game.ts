import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { Vec2 } from "./Vec2";
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
  gameOver: boolean = false;
  enemySplitFactor: number = 2;
  score: number = 0;
  level: number = 1;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(ctx, this);
    this.enemies = this.spawnEnemies();

    document.addEventListener("keydown", (evt) => {
      if (this.gameOver && evt.key === "r") {
        this.refresh();
      }
    });
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
    if (!this.gameOver) this.detectCollisions();
    if (!this.enemies.length) {
      this.level++;
      this.enemies = this.spawnEnemies();
      this.projectiles = [];
      this.resetPlayer();
    }
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
          projectile.isActive = false;
          enemy.requiredHits--;
          this.score += 10 * enemy.stage;
          if (enemy.requiredHits === 0) {
            enemy.isActive = false;
            if (enemy.stage < 3) {
              for (let i = 0; i < this.enemySplitFactor; i++) {
                this.enemies.push(
                  new Enemy(
                    this.ctx,
                    enemy.pos.copy(),
                    enemy.stage + 1,
                    enemy.scale / 2
                  )
                );
              }
            }
          }
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
      this.gameOver = true;
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let enemy of this.enemies) {
      enemy.draw();
    }
    for (let projectile of this.projectiles) {
      projectile.draw();
    }
    if (!this.gameOver) this.player.draw();

    if (this.gameOver) {
      this.showGameOver();
    }

    this.showScore();
    this.showLevel();
  }

  private spawnEnemies(): Enemy[] {
    console.log('spawning enemies...');
    console.log(this.level);
    let enemies = [];
    for (let i = 0; i < this.level * 2; i++) {
      enemies.push(new Enemy(this.ctx, new Vec2(0, 0), 1, 1));
    }
    return enemies;
  }

  private showGameOver(): void {
    // overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "crimson";
    this.ctx.strokeStyle = "darkred";
    this.ctx.lineWidth = 5;
    this.ctx.font = "64px monospace";
    this.ctx.textAlign = "center";
    this.ctx.strokeText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 - 50
    );
    this.ctx.fillText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 - 50
    );
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.font = "48px monospace";
    this.ctx.strokeText(
      'Press "R" to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
    this.ctx.fillText(
      'Press "R" to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
  }

  private refresh(): void {
    this.score = 0;
    this.projectiles = [];
    this.enemies = this.spawnEnemies();
    this.resetPlayer();
    this.gameOver = false;
  }

  private resetPlayer(): void {
    this.player.pos = new Vec2(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
    this.player.vel = new Vec2(0, 0);
    this.player.rotation = 0;
  }

  private showScore(): void {
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    this.ctx.textAlign = "right";
    this.ctx.font = "30px monospace";
    this.ctx.strokeText("Score: " + this.score, this.ctx.canvas.width - 50, 50);
    this.ctx.fillText("Score: " + this.score, this.ctx.canvas.width - 50, 50);
  }

  private showLevel(): void {
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    this.ctx.textAlign = "left";
    this.ctx.font = "30px monospace";
    this.ctx.strokeText("Level: " + this.level, 50, 50);
    this.ctx.fillText("Level: " + this.level, 50, 50);
  }
}
