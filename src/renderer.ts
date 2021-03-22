import { em, player } from "./index";

export const canvas = <HTMLCanvasElement>document.getElementById("game");
export const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false;

let currentMs = 0;

export const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  em.entities.forEach((entity) => {
    entity.tick();
    ctx.fillStyle = "white";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    //TODO: Fix why the aim is off.
    ctx.translate(
      -player.position.x + canvas.width / 2,
      -player.position.y + canvas.height / 2
    );
    ctx.globalAlpha = currentMs / 10000;
    entity.render(ctx);
    ctx.restore();
  });
  currentMs+=100;
  requestAnimationFrame(loop);
};
