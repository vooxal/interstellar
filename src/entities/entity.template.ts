import { Vector } from "../util/vector";
import { Entity, EntityParams } from "./index";
interface TemplateParams extends EntityParams {
  health: number;
  speed?: number;
  airFriction?: number;
  acceleration: Vector;
  rotation?: number;
}

export class EntityTemplate extends Entity {
  constructor({
    position,
    acceleration = new Vector(0, 0),
    size = new Vector(25, 25),
    health,
    speed = 1,
    airFriction = 0.1,
  }: TemplateParams) {
    super({ position, size });
  }
  tick() {}
  render(ctx: CanvasRenderingContext2D) {}
}
