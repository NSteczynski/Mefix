import Collider2D from '../Collider2D'
import Vector2 from '../../Maths/Vector2'

const defaultPoints = [
  new Vector2( 0.0,  1.0),
  new Vector2( 1.0,  0.0),
  new Vector2( 0.5, -1.0),
  new Vector2(-0.5, -1.0),
  new Vector2(-1.0,  0.0)
]

export default class PolygonCollider2D extends Collider2D {
  private _points: Array<Vector2> = []

  /**
   * Creates a new Box Collider 2D component.
   * @param points The points of the collider. Default: defaultPoints
   * @param offset The offset of the collider. Default: Vector2.zero
   */
  public constructor(points: Array<Vector2> = defaultPoints, offset: Vector2 = Vector2.zero) {
    super(offset)
    this._points = points
  }

  /** The points of the collider. */
  public get points(): Array<Vector2> {
    return this._points
  }

  /** The points of the collider. */
  public set points(value: Array<Vector2>) {
    this._points = value
    this.calculateVertices()
  }

  public get center(): Vector2 {
    return this.offset.multiply(this.transform.scale).rotate(this.transform.rotation).add(this.owner.getWorldPosition())
  }

  protected calculateVertices(): void {
    const vectorWH = new Vector2(1, 1)
    const vectorOff = new Vector2(this._offset.x, this._offset.y)

    this._vertices = this._points.reduce((r, point, index): Array<Vector2> => {
      const nextIndex = index + 1 === this.points.length ? 0 : index + 1
      r.push(point.multiply(vectorWH).add(vectorOff))
      r.push(this._points[nextIndex].multiply(vectorWH).add(vectorOff))
      return r
    }, [])
    super.calculateVertices()
  }
}