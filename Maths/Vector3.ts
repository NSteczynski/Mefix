import Vector2 from "./Vector2"

/** Represents a 3-parameter vector. */
export default class Vector3 {
  /** The x parameter. */
  public x: number
  /** The y parameter. */
  public y: number
  /** The z parameter. */
  public z: number

  /**
   * Creates a new vector 3.
   * @param x The x parameter.
   * @param y The y parameter.
   * @param z The z parameter.
   */
  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  /** Returns a vector3 with all components set to 0. */
  public static get zero(): Vector3 {
    return new Vector3(0, 0, 0)
  }

  /** Returns a vector3 with all components set to 1. */
  public static get one(): Vector3 {
    return new Vector3(1, 1, 1)
  }

  /** Returns the data of vector as a number array. */
  public toArray(): Array<number> {
    return [this.x, this.y, this.z]
  }

  /** Returns the data of vector as a Float32Array. */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Calculates the difference between vector and provided vector.
   * @param vector The vector to calculate distance.
   */
  public distance(vector: Vector3): number {
    const difference = this.substract(vector)
    return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2) + Math.pow(difference.z, 2))
  }

  /**
   * Adds the provided vector to vector.
   * @param vector The vector to be added.
   */
  public add(vector: Vector3): Vector3 {
    const x = this.x + vector.x
    const y = this.y + vector.y
    const z = this.z + vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Subtracts the provided vector from vector.
   * @param vector The vector to be subtracted.
   */
  public substract(vector: Vector3): Vector3 {
    const x = this.x - vector.x
    const y = this.y - vector.y
    const z = this.z - vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Multiplies vector by the provided vector.
   * @param vector The vector to be multiplied by.
   */
  public multiply(vector: Vector3): Vector3 {
    const x = this.x * vector.x
    const y = this.y * vector.y
    const z = this.z * vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Divides vector by the provided vector.
   * @param vector The vector to be divided by.
   */
  public divide(vector: Vector3): Vector3 {
    const x = this.x / vector.x
    const y = this.y / vector.y
    const z = this.z / vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Rotates in X axis vector by provided radians.
   * @param radians The rotation in radians.
   */
  public rotateX(radians: number): Vector3 {
    const sinus = Math.sin(radians)
    const cosinus = Math.cos(radians)
    const y = cosinus * this.y - sinus * this.z
    const z = sinus * this.y + cosinus * this.z
    return new Vector3(this.x, y, z)
  }

  /**
   * Rotates in Y axis vector by provided radians.
   * @param radians The rotation in radians.
   */
  public rotateY(radians: number): Vector3 {
    const sinus = Math.sin(radians)
    const cosinus = Math.cos(radians)
    const z = cosinus * this.z - sinus * this.x
    const x = sinus * this.z + cosinus * this.x
    return new Vector3(x, this.y, z)
  }

  /**
   * Rotates in Z axis vector by provided radians.
   * @param radians The rotation in radians.
   */
  public rotateZ(radians: number): Vector3 {
    const sinus = Math.sin(radians)
    const cosinus = Math.cos(radians)
    const x = cosinus * this.x - sinus * this.y
    const y = sinus * this.x + cosinus * this.y
    return new Vector3(x, y, this.z)
  }

  /**
   * Rotates vector by provided vector.
   * @param vector The rotation in vector.
   */
  public rotate(vector: Vector3): Vector3 {
    return this.rotateX(vector.x).rotateY(vector.y).rotateZ(vector.z)
  }

  /** Returns this vector as vector2, without z parameter. */
  public toVector2(): Vector2 {
    return new Vector2(this.x, this.y)
  }
}