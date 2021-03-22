import { SAT } from "./sat";
import { Vector } from "./vector";

export abstract class Collider {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  // abstract isColliding(collider: Collider): boolean;
}

export class PolygonCollider extends Collider {
  vertices: Vector[];
  constructor(...vertices: Vector[]) {
    super("polygon");
    this.vertices = vertices;
  }
  transformedVertices(parent: any) { //FIXME: PLEASE DO NOT YOLO NEXT TIME ;-;
    return this.vertices.map((vert) => {
      var newVert = vert.copy;
      if (parent.rotation != 0) {
        let hyp = Math.hypot(vert.x, vert.y);
        let angle = Math.atan2(vert.y, vert.x);
        angle += -parent.rotation;

        newVert.x = Math.cos(angle) * hyp;
        newVert.y = Math.sin(angle) * hyp;
      }

      return newVert;
    });
  }
  get normals() {
    return SAT.getNormals(this.vertices);
  }
}

export class CircleCollider extends Collider {
  radius: number;
  constructor(radius: number) {
    super("circle");
    this.radius = radius;
  }
  isColliding(collider: Collider) {
    if (collider instanceof CircleCollider) {
      return true;
    }
    return false;
  }
}
