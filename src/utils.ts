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

/**
 * Returns random integer in range min(inclusive) - max(exclusive)
 */
export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function circleCircleCollisionDetected(
  circle1: { pos: Vec2; radius: number },
  circle2: { pos: Vec2; radius: number }
): boolean {
  const distance = Vec2.dist(circle1.pos, circle2.pos);
  return distance <= circle1.radius + circle2.radius;
}

export function obbCircleCollisionDetected(
  obb: { pos: Vec2; rotation: number; width: number; height: number },
  circle: { pos: Vec2; radius: number }
): boolean {
  const D = Vec2.subtract(circle.pos, obb.pos); // vector pointing from obb to circle
  const localXAxis = new Vec2(Math.cos(obb.rotation), Math.sin(obb.rotation));
  const localYAxis = new Vec2(-Math.sin(obb.rotation), Math.cos(obb.rotation));
  const projX = Vec2.dot(D, localXAxis);
  const projY = Vec2.dot(D, localYAxis);
  const clampedProjX = clamp(projX, -obb.width / 2, obb.width / 2);
  const clampedProjY = clamp(projY, -obb.height / 2, obb.height / 2);
  const localNearestX = Vec2.scale(localXAxis, clampedProjX);
  const localNearestY = Vec2.scale(localYAxis, clampedProjY);
  const localNearestPt = Vec2.add(localNearestX, localNearestY);
  const globalNearestPt = Vec2.add(localNearestPt, obb.pos);
  const collisionDetected =
    Vec2.dist(globalNearestPt, circle.pos) <= circle.radius;
  return collisionDetected;
}
