import Collider2D from '../Collider2D'
import Vector2 from '../../Maths/Vector2'
import Matrix from '../../Maths/Matrix'
import Transform from '../../Maths/Transform'

export default class CircleCollider2D extends Collider2D {
  private _radius: number

  /**
   * Creates a new Circle Collider 2D component.
   * @param radius The radius of the collider. Default: 1
   * @param offset The offset of the collider. Default: Vector2.zero
   */
  public constructor(radius: number = 1, offset: Vector2 = Vector2.zero) {
    super(offset)
    this._radius = radius
  }

  /** The radius of the collider. */
  public get radius(): number {
    return this._radius
  }

  /** The radius of the collider. */
  public set radius(value: number) {
    this._radius = this.radius
  }

  public render(view: Matrix, projection: Matrix): void {
    if (!this._material.diffuseTexture.isLoaded)
      return undefined
    // this.calculateVertices()
    this._material.apply(new Transform(this.owner.worldPosition).getTransformationMatrix(), view, projection)

    this._buffer.bind()
    this._buffer.draw()
  }

  protected calculateVertices(): void {
    const scale =  this.owner.worldScale.x > this.owner.worldScale.y ? this.owner.worldScale.x : this.owner.worldScale.y
    const width = this._radius * scale
    const height = this._radius * scale
    const offX = this.offset.x * width * 2
    const offY = this.offset.y * height * 2
    const walls = 180

    this._vertices = []

    for (let i = 0; i <= walls; i++) {
      this._vertices.push(new Vector2(
        Math.cos(Math.PI * i / walls * 2) * width + offX,
        Math.sin(Math.PI * i / walls * 2) * height + offY
      ))
      this._vertices.push(new Vector2(
        Math.cos(Math.PI * (i + 1) / walls * 2) * width + offX,
        Math.sin(Math.PI * (i + 1) / walls * 2) * height + offY
      ))
    }

    super.calculateVertices()
  }
}