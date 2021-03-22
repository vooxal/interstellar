import { Entity } from "../entities/index";
//TODO: Scene manager and fade-in/fade-out (ctx.globalAlpha)
export class EntityManager {
  entities: Entity[] = [];
  find(catagory: string | string[]) {
    if (typeof catagory === "string")
      return this.entities.filter((entity) =>
        entity.catagories.includes(catagory)
      );
    let final = this.entities;
    for (let cata of catagory) {
      final = final.filter((entity) => entity.catagories.includes(cata));
    }
    return final;
  }
  add(entity: Entity) {
    this.entities.push(entity);
    return entity;
  }
  remove(entity: Entity | number) {
    if (typeof entity === "number") this.entities.splice(entity, 1);
    this.entities.splice(this.entities.indexOf(entity as Entity), 1);
  }
}
