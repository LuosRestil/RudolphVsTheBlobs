import { CooldownBar } from "./CooldownBar";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { Splat } from "./Splat";
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
  splats: Splat[] = [];
  gameOver: boolean = false;
  enemySplitFactor: number = 2;
  score: number = 0;
  level: number = 1;
  cooldownBar: CooldownBar;
  mainSong: HTMLAudioElement = new Audio("main-song.ogg");
  gameOverSong: HTMLAudioElement = new Audio("game-over.wav");
  playerDeathSound: HTMLAudioElement = new Audio("player-death.wav");
  levelUpSound: HTMLAudioElement = new Audio("level-up.mp3");

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(ctx, this);
    this.enemies = this.spawnEnemies();

    this.mainSong.preload = "auto";
    this.mainSong.loop = true;
    this.mainSong.volume = 0.4;
    this.mainSong.play();

    this.gameOverSong.preload = "auto";
    this.gameOverSong.volume = 0.5;
    this.playerDeathSound.preload = "auto";
    this.playerDeathSound.volume = 0.5;
    this.levelUpSound.preload = "auto";

    this.cooldownBar = new CooldownBar(ctx, this.player);

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
    this.splats = this.splats.filter((splat) => splat.isActive);
    this.draw(dts);
    this.update(dts);
    if (!this.gameOver) this.detectCollisions();
    if (!this.enemies.length) {
      this.level++;
      this.enemies = this.spawnEnemies();
      this.projectiles = [];
      this.resetPlayer();
      this.levelUpSound.play();
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
    for (let splat of this.splats) {
      splat.update(dts);
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
              enemy.pop();
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
            } else {
              enemy.splat();
              this.splats.push(
                new Splat(
                  enemy.pos.copy(),
                  enemy.colors.fill[0],
                  enemy.colors.stroke[0]
                )
              );
            }
          } else {
            enemy.ding();
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
      this.splats.push(new Splat(this.player.pos.copy(), "crimson", "darkred"));
      this.gameOver = true;
      this.mainSong.pause();
      this.mainSong.currentTime = 0;
      this.playerDeathSound.play();
      this.gameOverSong.play();
    }
  }

  private draw(dts: number): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let enemy of this.enemies) {
      enemy.draw();
    }
    for (let projectile of this.projectiles) {
      projectile.draw();
    }
    for (let splat of this.splats) {
      splat.draw(this.ctx);
    }

    if (!this.gameOver) this.player.draw();

    this.cooldownBar.draw(dts);

    if (this.gameOver) {
      this.showGameOver();
    }

    this.showScore();
    this.showLevel();
  }

  private spawnEnemies(): Enemy[] {
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
      'Press R to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
    this.ctx.fillText(
      'Press R to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
  }

  private refresh(): void {
    this.score = 0;
    this.level = 1;
    this.projectiles = [];
    this.enemies = this.spawnEnemies();
    this.resetPlayer();
    this.gameOver = false;
    this.gameOverSong.pause();
    this.gameOverSong.currentTime = 0;
    this.mainSong.play();
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
