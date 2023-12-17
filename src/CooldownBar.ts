import { Player } from "./Player";

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
    // flashing for overheat message
    this.flashCounter += dts;
    if (this.flashCounter > 0.5) {
      this.flashCounter = 0;
      this.showText = !this.showText;
    }

    // fill with gradient or red if overheat
    const ctx = this.ctx;
    const canvas = ctx.canvas;
    ctx.fillStyle = this.player.overheat ? "red" : this.gradient;
    ctx.fillRect(canvas.width/2 - this.width/2, this.y, this.width, this.height);

    // overheat text
    if (this.player.overheat && this.showText) {
      ctx.font = "28px monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("OVERHEAT", canvas.width / 2, this.y + this.height - 5);
    }

    // hide unused capacity
    ctx.fillStyle = "black";
    ctx.fillRect(
      canvas.width / 2 + this.width / 2,
      this.y,
      -this.width * this.player.cookieCannonCapacity,
      this.height
    );

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
