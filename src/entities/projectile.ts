import { Entity, EntityParams } from "./index";
import { em } from "../index";
import { keypress } from "../listeners";
import { Vector } from "../util/vector";
import { CircleCollider } from "../util/colliders";
interface ProjectileParams extends EntityParams {
  rotation: number;
  creation?: number;
  speed?: number;
  damage?: number;
  radius?: number;
}

export class EntityProjectile extends Entity {
  rotation: number;
  creation: number;
  speed: number;
  damage?: number;
  radius: number;
  collider: CircleCollider;
  constructor({
    position,
    radius = 5,
    rotation,
    creation = Date.now(),
    speed = 15,
    catagories,
    damage = 10,
  }: ProjectileParams) {
    super({
      position,
      size: new Vector(radius, radius),
      catagories: ["projectile", ...catagories],
    });
    this.rotation = rotation;
    this.creation = creation;
    this.speed = speed;
    this.damage = damage;
    this.radius = radius;
    this.collider = new CircleCollider(this.radius);
  }
  tick() {
    if (Date.now() > this.creation + 3000) em.remove(this);
    this.position.x -= this.speed * Math.sin(this.rotation);
    this.position.y -= this.speed * Math.cos(this.rotation);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.size.x, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}
