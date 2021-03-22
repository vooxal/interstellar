import { Entity, EntityParams } from "./index";
import { em } from "../index";
import { keypress } from "../listeners";
import { Vector } from "../util/vector";
import { CircleCollider, PolygonCollider } from "../util/colliders";
interface LazerParams extends EntityParams {
  rotation: number;
  creation?: number;
  damage?: number;
  width?: number;
}

export class EntityLazer extends Entity {
  rotation: number;
  creation: number;
  damage?: number;
  width: number;
  radius: number;
  collider: PolygonCollider;
  constructor({
    position,
    width = 5,
    rotation,
    creation = Date.now(),
    catagories,
    damage = 10,
  }: LazerParams) {
    super({
      position,
      size: new Vector(width, Number.MAX_VALUE),
      catagories: ["lazer", ...catagories],
    });
    this.rotation = rotation;
    this.creation = creation;
    this.damage = damage;
    this.width = width;
    this.collider = new PolygonCollider(
      new Vector(this.width / 2, Number.MAX_VALUE),
      new Vector(-this.width / 2, Number.MAX_VALUE),
      new Vector(-this.width / 2, 0),
      new Vector(this.width / 2, 0)
    );
  }
  tick() {
    // if (Date.now() > this.creation + 3000) em.remove(this);
    // this.position.x -= this.speed * Math.sin(this.rotation);
    // this.position.y -= this.speed * Math.cos(this.rotation);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    let vertices = this.collider.transformedVertices(this);
    for (let i in this.collider.vertices) {
      ctx.fillStyle = "red";
      ctx.fillRect(vertices[i].x, vertices[i].y, 3, 3);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(
      vertices[0].x,
      vertices[0].y,
      vertices[0].x - vertices[1].x,
      Number.MAX_VALUE
    );
  }
}
