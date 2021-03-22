import { Entity, EntityParams } from "./index";
import { em } from "../index";
import { keypress, mouse } from "../listeners";
import { EntityProjectile } from "./projectile";
import { Vector } from "../util/vector";
import { PolygonCollider } from "../util/colliders";
import { SAT } from "../util/sat"; //TODO: change acceleration with velocity
import { canvas } from "../renderer";
interface PlayerParams extends EntityParams {
  speed?: number;
  airFriction?: number;
}
//TODO: SHIP TYPE INSTEAD
export class EntityPlayer extends Entity {
  speed: number;
  airFriction: number;
  acceleration: Vector;
  rotation: number;
  lastShot: number;
  health: number;
  collider: PolygonCollider;
  constructor({ position, size, speed = 1, airFriction = 0.1 }: PlayerParams) {
    super({ position, size, catagories: ["player"] });
    this.health = 100;
    this.acceleration = new Vector(0, 0);
    this.speed = speed;
    this.airFriction = airFriction;
    this.rotation = 0;
    this.lastShot = Date.now();
    this.collider = new PolygonCollider(
      new Vector(0, -this.size.y / 2),
      new Vector(this.size.x / 2, this.size.y / 2),
      new Vector(-this.size.x / 2, this.size.y / 2)
    );
  }
  shoot() {
    //TODO: Make this look better and new weapons
    var vertex = new Vector(0, -this.size.y / 2);

    let hyp = Math.hypot(vertex.x, vertex.y);
    let angle = Math.atan2(vertex.y, vertex.x);
    angle += -this.rotation;

    vertex.x = Math.cos(angle) * hyp;
    vertex.y = Math.sin(angle) * hyp;
    em.add(
      new EntityProjectile({
        position: Vector.add(vertex, this.position),
        rotation:
          this.rotation,
        catagories: ["friendly"],
      })
    );
  }
  tick() {
    this.rotation %= 360;
    //Controls
    if (keypress.w || keypress.ArrowUp) this.acceleration.y -= this.speed;
    if (keypress.a || keypress.ArrowLeft) this.acceleration.x -= this.speed;
    if (keypress.s || keypress.ArrowDown) this.acceleration.y += this.speed;
    if (keypress.d || keypress.ArrowRight) this.acceleration.x += this.speed;
    //Applying movement //TODO: Rework?
    this.acceleration.x /= 1 + this.airFriction;
    this.acceleration.y /= 1 + this.airFriction;
    this.position = Vector.add(this.position, this.acceleration);
    // this.position.x += this.acceleration.x; // * Math.sin(this.rotation);
    // this.position.y += this.acceleration.y; // * Math.cos(this.rotation);
    this.rotation =
      -Math.atan2(canvas.height / 2 - mouse.y, canvas.width / 2 - mouse.x) +
      Math.PI / 2;
    //Shooting
    if (mouse.down && this.lastShot + 100 < Date.now()) {
      this.shoot();
      this.lastShot = Date.now();
    }
    //Death
    if (this.health <= 0) em.remove(this); //TODO: make it so it just moves you oob and respawns you.
    //Collisions
    let colliding = false;
    em.find(["enemy", "projectile"]).forEach((projectile: EntityProjectile) => {
      if (SAT.circlePolygonTest(projectile, this) == true) {
        colliding = true;
        this.health -= projectile.damage;
        em.remove(projectile);
      }
    });
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    for (let i in this.collider.vertices) {
      let vertices = this.collider.transformedVertices(this);
      ctx.fillStyle = "red";
      ctx.fillRect(vertices[i].x - 5, vertices[i].y - 5, 10, 10);
    }
    ctx.rotate(-this.rotation);
    ctx.fillStyle = `rgb(255, ${255 * (this.health / 100)}, ${
      255 * (this.health / 100)
    })`;
    ctx.beginPath();
    ctx.moveTo(0, -this.size.y / 2);
    ctx.lineTo(this.size.x / 2, this.size.y / 2);
    ctx.lineTo(0, this.size.y / 4);
    ctx.lineTo(-this.size.x / 2, this.size.y / 2);
    ctx.lineTo(0, -this.size.y / 2);
    ctx.closePath();
    ctx.fill();
  }
}
