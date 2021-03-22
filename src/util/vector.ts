export class Vector {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  set magnitude(value) {
    let length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    if (length == 0) return;
    let ratio = value / length;
    this.x *= ratio;
    this.y *= ratio;
  }
  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  get copy() {
    return Object.assign({}, this);
  }
  normalize() {
    this.magnitude = 1;
  }
  static flattenPolygon(points: Vector[], axis: Vector): MinMax {
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (const vector of points) {
      const dot = Vector.dotProduct(vector, axis);
      if (dot < min) min = dot;
      if (dot > max) max = dot;
    }
    return { min: min, max: max };
  }
  static flattenCircle(radius: number, axis: Vector): MinMax {
    let proj = this.dotProduct(axis, new Vector(0, 0));
    return {
      min: proj - radius,
      max: proj + radius,
    };
  }
  static add(...vectors: Vector[]) {
    let finalVector = new Vector(0, 0);
    for (let vector of vectors) {
      finalVector.x += vector.x;
      finalVector.y += vector.y;
    }
    return finalVector;
  }
  static subtract(minuend: Vector, subtrahend: Vector) {
    return new Vector(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
  }
  static dotProduct(multiplicand: Vector, multiplier: Vector) {
    return multiplicand.x * multiplier.x + multiplicand.y * multiplier.y;
  }
}
export interface MinMax {
  min: number;
  max: number;
}
