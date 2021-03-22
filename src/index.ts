import { EntityPlayer } from "./entities/player";
import { loop } from "./renderer";
import { EntityManager } from "./managers/entity";
import { EntityTurret } from "./entities/turret";
import { Vector } from "./util/vector";
import { EntityProjectile } from "./entities/projectile";
import { EntityParticleCircle } from "./entities/particle";
import { EntityText } from "./entities/text";
import { EntityLazer } from "./entities/lazer";
class Game {}
export const em = new EntityManager();
//@ts-ignore
window.em = em;
export const player = em.add(
  new EntityPlayer({
    position: new Vector(100, 100),
    speed: 0.75,
    airFriction: 0.075,
    size: new Vector(50, 64),
  })
);

let turret = em.add(
  new EntityTurret({
    position: new Vector(700, 600),
    size: new Vector(25, 25),
  })
);
let text = em.add(
  new EntityText({
    position: new Vector(25, 200),
    text: "Welcome to Interstellar!",
    fontSize: 14,
  })
);
let text2 = em.add(
  new EntityText({
    position: new Vector(-50, 600),
    text: "This is a turret, it will try shooting at you if you get too close",
    fontSize: 14,
  })
);
let lazer = em.add(
  new EntityLazer({
    position: new Vector(-50, 600),
    width: 5,
    rotation: 0,
    catagories: ["friendly"],
  })
);
EntityParticleCircle.create(new Vector(100, 100), 10, 0);
export const dist = (p1: Vector, p2: Vector) => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};
//TODO: Start Menu
loop();
