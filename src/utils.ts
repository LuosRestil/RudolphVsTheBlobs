import { Vec2 } from "./Vec2";

export function screenWrap(
  gameObject: { pos: Vec2 },
  ctx: CanvasRenderingContext2D
): void {
  const canvas = ctx.canvas;
  if (gameObject.pos.x > canvas.width) {
    gameObject.pos.x = 0;
  } else if (gameObject.pos.y > canvas.height) {
    gameObject.pos.y = 0;
  }
  if (gameObject.pos.x < 0) {
    gameObject.pos.x = canvas.width;
  } else if (gameObject.pos.y < 0) {
    gameObject.pos.y = canvas.height;
  }
}

export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
