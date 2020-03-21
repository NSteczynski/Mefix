import Collider2D from '../Collider2D'
import Vector2 from '../../Maths/Vector2'

const points = [
  new Vector2(-1.0,  1.0),
  new Vector2( 1.0,  1.0),
  new Vector2( 1.0, -1.0),
  new Vector2(-1.0, -1.0)
]

export default class BoxCollider2D extends Collider2D {
  private _size: Vector2

  /**
   * Creates a new Box Collider 2D component.
   * @param size The size of the collider. Default: Vector2.one
   * @param offset The offset of the collider. Default: Vector2.zero
   */
  public constructor(size: Vector2 = Vector2.one, offset: Vector2 = Vector2.zero) {
    super(offset)
    this._size = size
  }

  /** The size of the collider. */
  public get size(): Vector2 {
    return this._size
  }

  /** The size of the collider. */
  public set size(value: Vector2) {
    this._size = value
    this.calculateVertices()
  }

  /** The points of the collider. */
  public get points(): Array<Vector2> {
    return points.map(point => point.multiply(this._size))
  }

  protected calculateVertices(): void {
    this._vertices = points.reduce((r, point, index): Array<Vector2> => {
      const nextIndex = index + 1 === points.length ? 0 : index + 1
      r.push(point.multiply(this._size).add(this._offset))
      r.push(points[nextIndex].multiply(this._size).add(this._offset))
      return r
    }, [])

    super.calculateVertices()
  }
}