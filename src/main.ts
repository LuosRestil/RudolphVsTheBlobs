import { Game } from "./Game";
import { Vec2 } from "./Vec2";
import "./style.css";
import { screenWrap } from "./utils";

let gameStarted = false;

document.addEventListener("keydown", startGame);

const storyButton = document.getElementById("story-btn");
const attributionsButton = document.getElementById("attributions-btn");
storyButton?.addEventListener("click", () => showScreen("story-screen"));
attributionsButton?.addEventListener("click", () =>
  showScreen("attributions-screen")
);

document
  .querySelectorAll(".back-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => showScreen("title-screen"))
  );

const flashElements = document.querySelectorAll(".flash") as NodeListOf<HTMLElement>;
setInterval(() => flashElements.forEach(elem => elem.style.visibility = (elem.style.visibility === "hidden" ? "visible": "hidden")), 500);

const introSong: HTMLAudioElement = new Audio("intro-song.mp3");
introSong.loop = true;
introSong.volume = 0.5;
document.addEventListener('mousemove', () => {
  introSong.play();
});

function showScreen(id: string) {
  const screens = document.querySelectorAll(
    "div.screen"
  ) as NodeListOf<HTMLDivElement>;
  screens.forEach((screen) => (screen.style.display = "none"));
  (document.getElementById(id) as HTMLDivElement).style.display = "flex";
}

function startGame(evt: KeyboardEvent): void {
  if (evt.key === "r") {
    const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    (
      document.querySelectorAll("div.screen") as NodeListOf<HTMLDivElement>
    ).forEach((elem) => (elem.style.display = "none"));
    canvas.style.display = "block";

    new Game(ctx).start();

    document.removeEventListener("keydown", startGame);
    gameStarted = true;
    introSong.pause();
  }
}

const bgcanvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
bgcanvas.width = 1280;
bgcanvas.height = 720;
const bgctx = bgcanvas.getContext("2d") as CanvasRenderingContext2D;
bgctx.fillStyle = "#555";
// create starfield
let starfield: { pos: Vec2; radius: number }[] = [];
for (let i = 0; i < 550; i++) {
  const x = Math.random() * bgcanvas.width;
  const y = Math.random() * bgcanvas.height;
  const radius = Math.random() * 3;
  starfield.push({ pos: new Vec2(x, y), radius });
}

let lastTime = 0;
let starSpeed = 30;
function animate(ms: number): void {
  if (gameStarted) return;

  requestAnimationFrame(animate);

  const dt = ms - lastTime;
  const dts = dt / 1000;
  lastTime = ms;

  bgctx.clearRect(0, 0, bgcanvas.width, bgcanvas.height);
  for (let star of starfield) {
    // update
    star.pos.x -= starSpeed * dts;
    screenWrap(star, bgctx);
    // draw
    bgctx.beginPath();
    bgctx.arc(star.pos.x, star.pos.y, star.radius, 0, Math.PI * 2);
    bgctx.fill();
  }
}
requestAnimationFrame(animate);
