import { Entity, EntityParams } from "./index";
interface TextParams extends EntityParams {
  text: string;
  fontSize: number;
}
export class EntityText extends Entity {
  text: string;
  fontSize: number;
  constructor({ position, text, fontSize }: TextParams) {
    super({ position });
    this.text = text;
    this.fontSize = fontSize;
  }
  setText(text: string) {
    this.text = text;
  }
  tick() {}
  render(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontSize}px sans-serif`;
    ctx.fillText(this.text, this.position.x, this.position.y);
  }
}
