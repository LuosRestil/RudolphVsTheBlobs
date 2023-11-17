import { Player } from "./Player";
import "./style.css";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

document.addEventListener("keydown", (evt) => {
  const key = evt.key;
  switch (key) {
    case "ArrowUp":
    case "w":
      keys.up = true;
      break;
    case "ArrowDown":
    case "s":
      keys.down = true;
      break;
    case "ArrowLeft":
    case "a":
      keys.left = true;
      break;
    case "ArrowRight":
    case "d":
      keys.right = true;
      break;
  }
});

document.addEventListener("keyup", (evt) => {
  const key = evt.key;
  switch (key) {
    case "ArrowUp":
    case "w":
      keys.up = false;
      break;
    case "ArrowDown":
    case "s":
      keys.down = false;
      break;
    case "ArrowLeft":
    case "a":
      keys.left = false;
      break;
    case "ArrowRight":
    case "d":
      keys.right = false;
      break;
  }
});

let lastTime = 0;
const speed = 200;

const player = new Player(ctx);

requestAnimationFrame(animate);

function animate(ms: number) {
  requestAnimationFrame(animate);

  const dt = ms - lastTime;
  const dts = dt / 1000;
  lastTime = ms;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  if (keys.up) player.pos.y -= speed * dts;
  if (keys.down) player.pos.y += speed * dts;
  if (keys.left) player.pos.x -= speed * dts;
  if (keys.right) player.pos.x += speed * dts;
}
