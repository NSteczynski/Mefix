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

  /** Returns the data of this vector as a number array. */
  public toArray(): Array<number> {
    return [this.x, this.y]
  }

  /** Returns the data of this vector as a Float32Array. */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Calculates the difference between this vector and provided vector.
   * @param vector The vector to calculate distance.
   */
  public distance(vector: Vector2): number {
    const difference = this.substract(vector)
    return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2))
  }

  /**
   * Adds the provided vector to this vector.
   * @param vector The vector to be added.
   */
  public add(vector: Vector2): Vector2 {
    const x = this.x + vector.x
    const y = this.y + vector.y
    return new Vector2(x, y)
  }

  /**
   * Subtracts the provided vector from this vector.
   * @param vector The vector to be subtracted.
   */
  public substract(vector: Vector2): Vector2 {
    const x = this.x - vector.x
    const y = this.y - vector.y
    return new Vector2(x, y)
  }

  /**
   * Multiplies this vector by the provided vector.
   * @param vector The vector to be multiplied by.
   */
  public multiply(vector: Vector2): Vector2 {
    const x = this.x * vector.x
    const y = this.y * vector.y
    return new Vector2(x, y)
  }

  /**
   * Divides this vector by the provided vector.
   * @param vector The vector to be divided by.
   */
  public divide(vector: Vector2): Vector2 {
    const x = this.x / vector.x
    const y = this.y / vector.y
    return new Vector2(x, y)
  }

  /**
   * Rotates this vector by provided radians.
   * @param radians The rotation in radians.
   */
  public rotate(radians: number): Vector2 {
    const sinus = Math.sin(radians)
    const cosinus = Math.cos(radians)
    const x = cosinus * this.x - sinus * this.y
    const y = sinus * this.x + cosinus * this.y
    return new Vector2(x, y)
  }
}