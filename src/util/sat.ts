import { Entity } from "../entities/index";
import { dist } from "../index";
import { CircleCollider, PolygonCollider } from "./colliders";
import { MinMax, Vector } from "./vector";

export const SAT = {
  //   rangeContainment(rangeA: MinMax, rangeB: MinMax) {
  //     let a = true;
  //     let b = true;
  //     if (rangeA.max > rangeB.max || rangeA.min < rangeB.min) a = false;
  //     if (rangeB.max > rangeA.max || rangeB.min < rangeA.min) b = false;
  //     return { a, b };
  //   },
  getNormals(vertices: Vector[]) {
    let normals: Vector[] = [];
    for (let i = 0; i < vertices.length; i++) {
      let point1 = vertices[i];
      let point2 = i >= vertices.length - 1 ? vertices[0] : vertices[i + 1]; // get the next index, or wrap around if at the end
      let axis = new Vector(-(point2.y - point1.y), point2.x - point1.x);
      axis.normalize();
      normals.push(axis);
    }
    return normals;
  },
  polygonPolygonTest(polygonA: PolygonCollider, polygonB: PolygonCollider) {
    let shortestDist = Number.MAX_VALUE;
  },
  circlePolygonTest(entityCircle: Entity, entityPolygon: Entity): boolean {
    let shortestDist = Number.MAX_VALUE;
    // Get rotated vertices
    let vertices = (entityPolygon.collider as PolygonCollider).transformedVertices(
      entityPolygon
    );
    //get offest of these 2 entities
    let offset = new Vector(
      entityPolygon.position.x - entityCircle.position.x,
      entityPolygon.position.y - entityCircle.position.y
    );
    // find the closest point
    let closestVertex = new Vector();
    for (let vertex of vertices) {
      let distance =
        entityCircle.position.x -
        (entityPolygon.position.x + vertex.x) ** 2 +
        entityCircle.position.y -
        (entityPolygon.position.y + vertex.y) ** 2;
      if (distance < shortestDist) {
        shortestDist = distance;
        closestVertex.x = entityPolygon.position.x + vertex.x;
        closestVertex.y = entityPolygon.position.y + vertex.y;
      }
    }

    // calculate the axis from the circle to the point
    let axis = new Vector(
      closestVertex.x - entityCircle.position.x,
      closestVertex.y - entityCircle.position.y
    );
    axis.normalize();

    let polyRange = Vector.flattenPolygon(vertices, axis);
    // shift the polygon along the axis
    var scalerOffset = Vector.dotProduct(axis, offset);
    polyRange.min += scalerOffset;
    polyRange.max += scalerOffset;

    let circleRange = Vector.flattenCircle(
      (entityCircle.collider as CircleCollider).radius,
      axis
    );

    if (
      polyRange.min - circleRange.max > 0 ||
      circleRange.min - polyRange.max > 0
    ) {
      // there is a gap - bail
      return false;
    }
    let distMin = circleRange.max - polyRange.min;
    shortestDist = Math.abs(distMin);
    // get the perpendicular axis that we will be projecting onto
    const normals = SAT.getNormals(vertices);
    // now loop over the polygon sides and do a similar thing
    for (let i in vertices) {
      // project each point onto the axis and circle
      polyRange = Vector.flattenPolygon(vertices, normals[i]);

      // shift the first polygons min max along the axis by the amount of offset between them
      var scalerOffset = Vector.dotProduct(normals[i], offset);
      polyRange.min += scalerOffset;
      polyRange.max += scalerOffset;

      // project the circle onto this axis
      circleRange = Vector.flattenCircle(
        (entityCircle.collider as CircleCollider).radius,
        normals[i]
      );

      // now check for a gap betwen the relative min's and max's
      if (
        polyRange.min - circleRange.max > 0 ||
        circleRange.min - polyRange.max > 0
      ) {
        // there is a gap - bail
        return false;
      }

      // check for containment

      distMin = circleRange.max - polyRange.min; // * -1;

      // check if this is the shortest by using the absolute val
      let distMinAbs = Math.abs(distMin);
      if (distMinAbs < shortestDist) shortestDist = distMinAbs;
    }

    // if you make it here then no gaps were found
    return true;
  },
  circleCircleTest(entityCircleA: Entity, entityCircleB: Entity): boolean {
    let totalRadius =
      (entityCircleA.collider as CircleCollider).radius +
      (entityCircleB.collider as CircleCollider).radius;
    let distanceBetween = dist(entityCircleA.position, entityCircleB.position);
    if (distanceBetween > totalRadius) return false; // too far apart
    return true;
  },
};