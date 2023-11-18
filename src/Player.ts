export class Player {
  width: number = 50;
  height: number = 25;
  pos: Vec2;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.pos = new Vec2(ctx.canvas.width / 2, ctx.canvas.height / 2);
  }

  draw() {
    this.ctx.save();

    this.ctx.translate(this.pos.x, this.pos.y);
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
    this.ctx.beginPath();
    this.ctx.arc(-this.width / 2, 0, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }
}
