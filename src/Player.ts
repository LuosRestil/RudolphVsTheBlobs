import { Vec2 } from "./Vec2";

type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export class Player {
  width: number = 50;
  height: number = 25;
  rotation: number = 0;
  rotationSpeed: number = Math.PI * 2;
  keys: Keys = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  pos: Vec2;
  vel: Vec2 = new Vec2(0, 0);
  accel: Vec2 = new Vec2(0, 0);
  propulsionForce: number = 1000;
  maxVel: number = 800;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.pos = new Vec2(ctx.canvas.width / 2, ctx.canvas.height / 2);

    document.addEventListener("keydown", (evt) => {
      const key = evt.key;
      switch (key) {
        case "ArrowUp":
        case "w":
          this.keys.up = true;
          break;
        case "ArrowDown":
        case "s":
          this.keys.down = true;
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
    });

    document.addEventListener("keyup", (evt) => {
      const key = evt.key;
      switch (key) {
        case "ArrowUp":
        case "w":
          this.keys.up = false;
          break;
        case "ArrowDown":
        case "s":
          this.keys.down = false;
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
    }
    this.vel.add(Vec2.scale(this.accel, dts));
    if (this.vel.mag() > this.maxVel) {
      this.vel.setMag(this.maxVel);
    }
    this.pos.add(Vec2.scale(this.vel, dts));
    this.accel.scale(0);
    this.screenWrap();
  }

  draw(): void {
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
    this.ctx.beginPath();
    this.ctx.arc(-this.width / 2, 0, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private applyPropulsionForce(): void {
    const force = Vec2.fromAngle(this.rotation, this.propulsionForce);
    this.accel.add(force);
  }

  private screenWrap(): void {
    const canvas = this.ctx.canvas;
    if (this.pos.x > canvas.width) {
      this.pos.x = 0;
    } else if (this.pos.y > canvas.height) {
      this.pos.y = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = canvas.width;
    } else if (this.pos.y < 0) {
      this.pos.y = canvas.height;
    }
  }
}
