import { Collider } from "../util/colliders";
import { Vector } from "../util/vector";

export interface EntityParams {
  position: Vector;
  size?: Vector;
  catagories?: string[];
}

export abstract class Entity {
  position: Vector;
  size?: Vector;
  catagories?: string[];
  collider?: Collider; //TODO: refactor into an array of colliders
  abstract tick(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
  constructor({
    position,
    size = new Vector(0, 0),
    catagories = [],
  }: EntityParams) {
    this.position = position;
    this.size = size;
    this.catagories = catagories;
  }
}
