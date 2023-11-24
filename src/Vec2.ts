export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vec2): Vec2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  static add(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }

  subtract(other: Vec2): Vec2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  static subtract(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x - v2.x, v1.y - v2.y);
  }

  scale(factor: number): Vec2 {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  static scale(vec: Vec2, factor: number): Vec2 {
    return new Vec2(vec.x * factor, vec.y * factor);
  }

  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize(): Vec2 {
    const mag = this.mag();
    return this.scale(1 / mag);
  }

  setMag(mag: number): Vec2 {
    return this.normalize().scale(mag);
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  static fromAngle(angle: number, magnitude: number = 1): Vec2 {
    const v = new Vec2(Math.cos(angle), Math.sin(angle));
    v.scale(magnitude);
    return v;
  }

  static dist(v1: Vec2, v2: Vec2): number {
    const xDist = Math.abs(v1.x - v2.x);
    const yDist = Math.abs(v1.y - v2.y);
    return Math.sqrt(xDist ** 2 + yDist ** 2);
  }

  static dot(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }
}
