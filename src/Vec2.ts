class Vec2 {
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
}
