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

  /** Returns the data of this vector as a number array. */
  public toArray(): Array<number> {
    return [this.x, this.y, this.z]
  }

  /** Returns the data of this vector as a Float32Array. */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Calculates the difference between this vector and provided vector.
   * @param vector The vector to calculate distance.
   */
  public distance(vector: Vector3): number {
    const difference = this.substract(vector)
    return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2) + Math.pow(difference.z, 2))
  }

  /**
   * Adds the provided vector to this vector.
   * @param vector The vector to be added.
   */
  public add(vector: Vector3): Vector3 {
    const x = this.x + vector.x
    const y = this.y + vector.y
    const z = this.z + vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Subtracts the provided vector from this vector.
   * @param vector The vector to be subtracted.
   */
  public substract(vector: Vector3): Vector3 {
    const x = this.x - vector.x
    const y = this.y - vector.y
    const z = this.z - vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Multiplies this vector by the provided vector.
   * @param vector The vector to be multiplied by.
   */
  public multiply(vector: Vector3): Vector3 {
    const x = this.x * vector.x
    const y = this.y * vector.y
    const z = this.z * vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Divides this vector by the provided vector.
   * @param vector The vector to be divided by.
   */
  public divide(vector: Vector3): Vector3 {
    const x = this.x / vector.x
    const y = this.y / vector.y
    const z = this.z / vector.z
    return new Vector3(x, y, z)
  }

  /**
   * Rotates this vector by provided radians.
   * @param radians The rotation in radians.
   */
  public rotate(radians: number): Vector3 {
    const sinus = Math.sin(radians)
    const cosinus = Math.cos(radians)
    const x = this.x * cosinus * sinus
    const y = this.y * sinus * sinus
    const z = this.z * cosinus
    return new Vector3(x, y, z)
  }
}