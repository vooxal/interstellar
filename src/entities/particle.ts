import { throws } from "assert";
import { access } from "fs/promises";
import { em } from "../index";
import { Vector } from "../util/vector";
import { Entity, EntityParams } from "./index";
interface ParticleCircleParams extends EntityParams {
  speed: number;
  acceleration: Vector;
  creation?: number;
  radius: number;
  alpha?: number;
  maxLife?: number;
}

export class EntityParticleCircle extends Entity {
  acceleration: Vector;
  creation: number;
  alpha: number;
  speed: number;
  constructor({
    position,
    acceleration = new Vector(2, 2),
    creation = Date.now(),
    radius = 7,
    speed = 1,
    alpha = 1,
  }: ParticleCircleParams) {
    super({
      position,
      size: new Vector(radius, radius),
      catagories: ["particle"],
    });
    this.acceleration = acceleration;
    this.alpha = alpha;
    this.speed = speed;
    this.creation = creation;
    let finalAcceleration = this.acceleration;
    finalAcceleration.x *= this.speed;
    finalAcceleration.y *= this.speed;
    this.acceleration = finalAcceleration;
  }
  tick() {
    this.position = Vector.add(this.position, this.acceleration);
    if (Date.now() > this.creation + 3000) em.remove(this);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1 - (Date.now() - this.creation) / 3000;
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.size.x, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  static create(position: Vector, amount: number, rotation: number) {
    //TODO: more changeable varibles
    for (let i = 0; i < amount; i++) {
      em.add(
        new this({
          position,
          speed: Math.random() * 5 + 5,
          acceleration: new Vector(
            Math.cos(rotation + Math.random() * 0.5),
            Math.sin(rotation + Math.random() * 0.5)
          ),
          radius: Math.floor(Math.random() * 10 + 3),
        })
      );
    }
  }
}
