import { dist, em } from "../index";
import { CircleCollider } from "../util/colliders";
import { SAT } from "../util/sat";
import { Vector } from "../util/vector";
import { Entity, EntityParams } from "./index";
import { EntityPlayer } from "./player";
import { EntityProjectile } from "./projectile";
//TODO: smooth rotation from the turret
interface TurretParams extends EntityParams {
  health?: number;
}
export class EntityTurret extends Entity {
  health: number;
  rotation: number;
  lastShot: number;
  collider = new CircleCollider(25);
  constructor({
    position,
    size = new Vector(25, 25),
    health = 100,
  }: TurretParams) {
    super({ position, size });
    this.health = health;
    this.rotation = 0;
    this.lastShot = Date.now();
  }
  tick() {
    const player = em.find("player")[0] as EntityPlayer;
    if (player == undefined) return;

    this.rotation =
      -Math.atan2(
        this.position.y - player.position.y,
        this.position.x - player.position.x
      ) +
      Math.PI / 2;
    if (
      this.lastShot + 200 < Date.now() &&
      dist(player.position, this.position) < 500
    ) {
      em.add(
        new EntityProjectile({
          position: new Vector(this.position.x, this.position.y),
          rotation: this.rotation + Math.random() * 0.05,
          catagories: ["enemy"],
        })
      );
      this.lastShot = Date.now();
    }
    if (this.health <= 0) em.remove(this);
    //Collision
    let colliding = false;
    em.find(["friendly", "projectile"]).forEach(
      (projectile: EntityProjectile) => {
        if (SAT.circleCircleTest(projectile, this) == true) {
          colliding = true;
          this.health -= projectile.damage;
          em.remove(projectile);
        }
      }
    );
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(-this.rotation);
    ctx.fillStyle = `rgb(255, ${255 * (this.health / 100)}, ${
      255 * (this.health / 100)
    })`;
    ctx.beginPath();
    ctx.arc(0, 0, this.size.x, 0, 2 * Math.PI);
    ctx.rect(
      -this.size.x / 4,
      2 * -this.size.y + 5,
      this.size.x / 2,
      this.size.y
    );
    ctx.closePath();
    ctx.fill();
  }
}
