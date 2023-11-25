import { Game } from "./Game";
import "./style.css";

document.addEventListener("keydown", startGame);

const titleScreen = document.getElementById("title-screen") as HTMLDivElement;

function startGame(evt: KeyboardEvent) {
  if (evt.key === "r") {
    const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    titleScreen.style.display = "none";
    canvas.style.display = "block";

    new Game(ctx).start();

    document.removeEventListener("keydown", startGame);
  }
}
