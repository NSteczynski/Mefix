import Vector3 from "./Vector3"
import Matrix from "./Matrix"

/** Represents a 2-parameter vector. */
export default class Vector2 {
  /** The x parameter. */
  public x: number
  /** The y parameter. */
  public y: number

  /**
   * Creates a new vector 2.
   * @param x The x parameter.
   * @param y The y parameter.
   */
  public constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  /** Returns a vector2 with all components set to 0. */
  public static get zero(): Vector2 {
    return new Vector2(0, 0)
  }

  /** Returns a vector2 with all components set to 1. */
  public static get one(): Vector2 {
    return new Vector2(1, 1)
  }

  /** Returns the data of vector as a number array. */
  public toArray(): Array<number> {
    return [this.x, this.y]
  }

  /** Returns the data of vector as a Float32Array. */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Calculates the difference between vector and provided vector.
   * @param vector The vector to calculate distance.
   */
  public distance(vector: Vector2 | Vector3): number {
    const difference = this.substract(vector)
    return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2))
  }

  /**
   * Adds the provided vector to vector.
   * @param vector The vector to be added.
   */
  public add(vector: Vector2 | Vector3): Vector2 {
    const x = this.x + vector.x
    const y = this.y + vector.y
    return new Vector2(x, y)
  }

  /**
   * Subtracts the provided vector from vector.
   * @param vector The vector to be subtracted.
   */
  public substract(vector: Vector2 | Vector3): Vector2 {
    const x = this.x - vector.x
    const y = this.y - vector.y
    return new Vector2(x, y)
  }

  /**
   * Multiplies vector by the provided vector.
   * @param vector The vector to be multiplied by.
   */
  public multiply(vector: Vector2 | Vector3): Vector2 {
    const x = this.x * vector.x
    const y = this.y * vector.y
    return new Vector2(x, y)
  }

  /**
   * Divides vector by the provided vector.
   * @param vector The vector to be divided by.
   */
  public divide(vector: Vector2 | Vector3): Vector2 {
    const x = this.x / vector.x
    const y = this.y / vector.y
    return new Vector2(x, y)
  }

  /**
   * Rotates vector by provided vector.
   * @param vector The rotation in vector.
   */
  public rotate(vector: Vector2 | Vector3): Vector2 {
    if (vector instanceof Vector2)
      return this.toVector3().rotateX(vector.x).rotateY(vector.y).toVector2()
    return this.toVector3().rotateX(vector.x).rotateY(vector.y).rotateZ(vector.z).toVector2()
  }

  /**
   * Returns axis from the vector and the provided vector.
   * @param vector The vector from where get axis.
   */
  public axis(vector: Vector2 | Vector3): Vector2 {
    const edge = this.substract(vector)
    return new Vector2(edge.y, -edge.x)
  }

  /**
   * Projects the vector with provided axis and returns min and max value.
   * @param axis The axis to project.
   * @param min The current min value.
   * @param max The current max value.
   */
  public project(axis: Vector2 | Vector3, min: number, max: number): Array<number> {
    const projection = axis.x * this.x + axis.y * this.y
    if (projection < min)
      min = projection
    if (projection > max)
      max = projection
    return [min, max]
  }

  /** Returns the absolute value of the vector. */
  public abs(): Vector2 {
    return new Vector2(Math.abs(this.x), Math.abs(this.y))
  }

  /** Returns vector3 from this vector with z = 0. */
  public toVector3(): Vector3 {
    return new Vector3(this.x, this.y, 0)
  }
}