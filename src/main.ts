import { Game } from "./Game";
import "./style.css";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

new Game(ctx).start();
