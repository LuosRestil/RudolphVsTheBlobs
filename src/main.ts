import { Player } from "./Player";
import "./style.css";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let lastTime = 0;

const player = new Player(ctx);

requestAnimationFrame(animate);

function animate(ms: number) {
  requestAnimationFrame(animate);

  const dt = ms - lastTime;
  const dts = dt / 1000;
  lastTime = ms;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update(dts);
  player.draw();
}
