export let keypress: any = {};
export let mouse: { x: number; y: number; down: boolean } = {
  x: 0,
  y: 0,
  down: false,
};
const keyUp = (e: KeyboardEvent) => {
  keypress[e.key] = false;
};
const keyDown = (e: KeyboardEvent) => {
  keypress[e.key] = true;
};
const mouseDown = (e: MouseEvent) => {
  mouse.down = true;
};
const mouseUp = (e: MouseEvent) => {
  mouse.down = false;
};
const mouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

document.addEventListener("keyup", keyUp);
document.addEventListener("keydown", keyDown);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
