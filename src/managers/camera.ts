import { Entity } from "../entities/index";

export class Camera {
  target: Entity;
  constructor(target: Entity) {
    this.target = target;
  }
}//TODO make camera lag behind
