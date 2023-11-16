import "./style.css";

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const width = 50;
const height = 25;
ctx.translate(canvas.width/2, canvas.height/2);
// body
ctx.fillStyle = "brown";
ctx.fillRect(-width / 2, -height / 2, width, height);
// nose
ctx.beginPath();
ctx.arc(width / 2, 0, 5, 0, Math.PI * 2);
ctx.fillStyle = "red";
ctx.fill();
// right eye
ctx.beginPath();
ctx.arc(width / 4, height / 4, 5, 0, Math.PI * 2);
ctx.fillStyle = "white";
ctx.fill();
ctx.beginPath();
ctx.arc(width / 4 + 3, height / 4, 3, 0, Math.PI * 2);
ctx.fillStyle = "black";
ctx.fill();
// left eye
ctx.beginPath();
ctx.arc(width / 4, -height / 4, 5, 0, Math.PI * 2);
ctx.fillStyle = "white";
ctx.fill();
ctx.beginPath();
ctx.arc(width / 4 + 3, -height / 4, 3, 0, Math.PI * 2);
ctx.fillStyle = "black";
ctx.fill();
// legs
ctx.fillStyle = "brown";
ctx.fillRect(0, -height / 2 - 10, 5, 10);
ctx.fillRect(0, height / 2, 5, 10);
ctx.fillRect(-20, -height / 2 - 10, 5, 10);
ctx.fillRect(-20, height / 2, 5, 10);
// tail
ctx.beginPath();
ctx.arc(-width / 2, 0, 5, 0, Math.PI * 2);
ctx.fill();