import { Game } from "./Game";
import { PowerupType } from "./Powerup";
import { Projectile } from "./Projectile";
import { Sparkles } from "./Sparkles";
import { Vec2 } from "./Vec2";
import { screenWrap } from "./utils";

type Keys = {
  up: boolean;
  left: boolean;
  right: boolean;
};

export class Player {
  width: number = 50;
  height: number = 25;
  rotation: number = 0;
  rotationSpeed: number = Math.PI * 1.75;
  keys: Keys = {
    up: false,
    left: false,
    right: false,
  };
  pos: Vec2;
  vel: Vec2 = new Vec2(0, 0);
  accel: Vec2 = new Vec2(0, 0);
  propulsionForce: number = 600;
  maxVel: number = 800;
  projectileSpeed: number = 200;
  cookieCannonCapacity = 1;
  overheat = false;
  ctx: CanvasRenderingContext2D;
  game: Game;
  sparkles: Sparkles;
  fireSound: HTMLAudioElement = new Audio("laser.wav");
  sparkleSound: HTMLAudioElement = new Audio("sparkle2.wav");
  overheatTimeout?: ReturnType<typeof setTimeout>;
  powerups: {
    [key: string]: {
      timeout?: ReturnType<typeof setTimeout>;
      isActive: boolean;
    };
  };
  powerupDuration: number = 10000;

  constructor(ctx: CanvasRenderingContext2D, game: Game) {
    this.ctx = ctx;
    this.game = game;
    this.pos = new Vec2(ctx.canvas.width / 2, ctx.canvas.height / 2);
    this.sparkles = new Sparkles();
    this.powerups = this.initializePowerups();

    this.fireSound.preload = "auto";
    this.sparkleSound.preload = "auto";
    this.sparkleSound.loop = true;

    document.addEventListener("keydown", (evt) => {
      if (this.game.gameOver) return;

      const key = evt.key;
      switch (key) {
        case "ArrowUp":
        case "w":
          this.keys.up = true;
          break;
        case "ArrowLeft":
        case "a":
          this.keys.left = true;
          break;
        case "ArrowRight":
        case "d":
          this.keys.right = true;
          break;
      }
      if (!evt.repeat && (key === " " || key === "f")) {
        this.fire();
      }
    });

    document.addEventListener("keyup", (evt) => {
      const key = evt.key;
      switch (key) {
        case "ArrowUp":
        case "w":
          this.keys.up = false;
          break;
        case "ArrowLeft":
        case "a":
          this.keys.left = false;
          break;
        case "ArrowRight":
        case "d":
          this.keys.right = false;
          break;
      }
    });
  }

  update(dts: number): void {
    if (this.keys.right) this.rotation += this.rotationSpeed * dts;
    if (this.keys.left) this.rotation -= this.rotationSpeed * dts;
    if (this.keys.up) {
      this.applyPropulsionForce();
      this.sparkles.isActive = true;
      if (this.sparkleSound.paused) {
        this.sparkleSound.play();
      }
    } else {
      this.sparkles.isActive = false;
      this.sparkleSound.pause();
      this.sparkleSound.currentTime = 0;
    }

    const buttPos = Vec2.fromAngle(this.rotation, -this.width / 2).add(
      this.pos
    );
    this.sparkles.update(dts, buttPos, this.rotation);

    this.vel.add(Vec2.scale(this.accel, dts));
    if (this.vel.mag() > this.maxVel) {
      this.vel.setMag(this.maxVel);
    }
    this.pos.add(Vec2.scale(this.vel, dts));
    this.accel.scale(0);
    screenWrap(this, this.ctx);

    this.cookieCannonCapacity += this.overheat ? 0 : 0.002;
    if (this.cookieCannonCapacity > 1) this.cookieCannonCapacity = 1;
    else if (this.cookieCannonCapacity < 0) {
      if (!this.overheat) this.triggerOverheat();
      else this.cookieCannonCapacity = 0;
    }
  }

  draw(): void {
    this.sparkles.draw(this.ctx);
    this.ctx.save();

    this.ctx.translate(this.pos.x, this.pos.y);
    this.ctx.rotate(this.rotation);

    // body
    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    // nose
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, 0, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    // right eye
    this.ctx.beginPath();
    this.ctx.arc(this.width / 4, this.height / 4, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.width / 4 + 3, this.height / 4, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    // left eye
    this.ctx.beginPath();
    this.ctx.arc(this.width / 4, -this.height / 4, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.width / 4 + 3, -this.height / 4, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    // legs
    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(0, -this.height / 2 - 10, 5, 10);
    this.ctx.fillRect(0, this.height / 2, 5, 10);
    this.ctx.fillRect(-20, -this.height / 2 - 10, 5, 10);
    this.ctx.fillRect(-20, this.height / 2, 5, 10);
    // tail
    this.ctx.fillStyle = "brown";
    this.ctx.beginPath();
    this.ctx.arc(-this.width / 2, 0, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  activatePowerup(type: PowerupType): void {
    this.powerups[type].isActive = true;
    if (this.powerups[type].timeout) clearTimeout(this.powerups[type].timeout);
    this.powerups[type].timeout = setTimeout(() => {
      this.powerups[type].isActive = false;
    }, this.powerupDuration);
  }

  initializePowerups() {
    const powerups = {
      [PowerupType.TripleShot]: { isActive: false },
      [PowerupType.FastCookies]: { isActive: false },
      [PowerupType.BlobPiercing]: { isActive: false },
      [PowerupType.UnlimitedCannon]: { isActive: false },
      [PowerupType.Shield]: { isActive: false },
    };
    return powerups;
  }

  private applyPropulsionForce(): void {
    const force = Vec2.fromAngle(this.rotation, this.propulsionForce);
    this.accel.add(force);
  }

  private fire(): void {
    if (this.overheat && !this.powerups[PowerupType.UnlimitedCannon].isActive) return;
    if (!this.fireSound.paused) {
      this.fireSound.currentTime = 0; // Restart the sound if it is playing
    }
    this.fireSound.play();

    const speed =
      this.projectileSpeed *
      (this.powerups[PowerupType.FastCookies].isActive ? 2 : 1);
    if (this.game.score > 0) this.game.score--;
    const nosePos = Vec2.fromAngle(this.rotation, this.width / 2).add(this.pos);
    const vel = Vec2.fromAngle(this.rotation, speed);
    this.game.projectiles.push(new Projectile(this.ctx, nosePos, vel));
    if (this.powerups[PowerupType.TripleShot].isActive) {
      console.log("firing tripleshot");
      console.log(this.powerups[PowerupType.TripleShot]);
      const leftVel = Vec2.fromAngle(this.rotation - 0.3, speed);
      this.game.projectiles.push(
        new Projectile(this.ctx, nosePos.copy(), leftVel)
      );
      const rightVel = Vec2.fromAngle(this.rotation + 0.3, speed);
      this.game.projectiles.push(
        new Projectile(this.ctx, nosePos.copy(), rightVel)
      );
    }

    if (!this.powerups[PowerupType.UnlimitedCannon].isActive) {
      this.cookieCannonCapacity -= 0.1;
    }
  }

  private triggerOverheat() {
    // TODO play overheat sound
    this.overheat = true;
    this.overheatTimeout = setTimeout(() => {
      // TODO play cooldown sound
      this.overheat = false;
      this.cookieCannonCapacity = 0;
    }, 5000);
  }
}
