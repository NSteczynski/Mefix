import Matrix from './Matrix'
import Vector3 from './Vector3'

/** Represents the transformation of an object, providing position, rotation and scale. */
export default class Transform {
  /** The position. Default: Vector3.zero */
  public position: Vector3 = Vector3.zero
  /** The rotation. Default: Vector3.zero */
  public rotation: Vector3 = Vector3.zero
  /** The rotation. Default: Vector3.one */
  public scale: Vector3 = Vector3.one

  /** Creates and returns a matrix based on this transform. */
  public getTransformationMatrix(): Matrix {
    const translation = Matrix.translation(this.position)
    const rotation = Matrix.rotation(this.rotation)
    const scale = Matrix.scale(this.scale)
    return Matrix.multiply(Matrix.multiply(translation, rotation), scale)
  }
}