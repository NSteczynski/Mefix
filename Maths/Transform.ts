import Matrix from './Matrix'
import Vector3 from './Vector3'

/** Represents the transformation of an object. */
export default class Transform {
  /** The transform position. */
  public position: Vector3 = Vector3.zero
  /** The transform rotation. */
  public rotation: Vector3 = Vector3.zero
  /** The transform scale. */
  public scale: Vector3 = Vector3.one

  /**
   * Creates a new transform.
   * @param position The transform position. Default: Vector3.zero
   * @param rotation The transform rotation. Default: Vector3.zero
   * @param scale The transform scale. Default: Vector3.one
   */
  public constructor(position: Vector3 = Vector3.zero, rotation: Vector3 = Vector3.zero, scale: Vector3 = Vector3.one) {
    this.position = position
    this.rotation = rotation
    this.scale = scale
  }

  /** Creates and returns a matrix based on this transform. */
  public getTransformationMatrix(): Matrix {
    const translation = Matrix.translation(this.position)
    const rotation = Matrix.rotation(this.rotation)
    const scale = Matrix.scale(this.scale)
    return Matrix.multiply(Matrix.multiply(translation, rotation), scale)
  }
}