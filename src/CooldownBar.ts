import { Player } from "./Player";
import { PowerupType } from "./Powerup";

export class CooldownBar {
  width: number = 600;
  height: number = 30;
  y: number = 30;
  radius: number = 30;
  ctx: CanvasRenderingContext2D;
  gradient: CanvasGradient;
  player: Player;
  flashCounter: number = 0;
  showText: boolean = false;

  constructor(ctx: CanvasRenderingContext2D, player: Player) {
    this.ctx = ctx;
    this.gradient = ctx.createLinearGradient(
      this.ctx.canvas.width / 2 - this.width / 2,
      this.y,
      this.width * 1.5,
      this.height
    );
    this.gradient.addColorStop(0, "green");
    this.gradient.addColorStop(0.5, "yellow");
    this.gradient.addColorStop(1, "red");
    this.player = player;
  }

  draw(dts: number) {
    const unlimited = this.player.powerups[PowerupType.UnlimitedCannon].isActive;
    const overheat = this.player.overheat;

    // flashing for overheat message
    this.flashCounter += dts;
    if (this.flashCounter > 0.5) {
      this.flashCounter = 0;
      this.showText = !this.showText;
    }

    const ctx = this.ctx;
    const canvas = ctx.canvas;
    if (unlimited) {
      ctx.fillStyle = "blue";
    } else if (overheat) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = this.gradient;
    }
    ctx.fillRect(canvas.width/2 - this.width/2, this.y, this.width, this.height);

    ctx.font = "28px monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (unlimited) {
      ctx.fillText("UNLIMITED", canvas.width / 2, this.y + this.height / 2 + 2);
    } else if (overheat && this.showText) {
      ctx.fillText("OVERHEAT", canvas.width / 2, this.y + this.height / 2 + 2);
    }

    // hide unused capacity
    if (!unlimited) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        canvas.width / 2 + this.width / 2,
        this.y,
        -this.width * this.player.cookieCannonCapacity,
        this.height
      );
    }

    // outline
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      canvas.width / 2 - this.width / 2,
      this.y,
      this.width,
      this.height,
    );
  }
}
