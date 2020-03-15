import Material from "./Material"
import MaterialManager from "./MaterialManager"
import Matrix from "../Math/Matrix"
import GLBuffer from '../WebGL/GLBuffer'
import Vertex from "./Vertex"
import AttributeInfo from "../WebGL/AttributeInfo"

/** Represents a sprite. */
export default class Sprite {
  private _name: string
  private _width: number = 0
  private _height: number = 0

  private _buffer: GLBuffer
  private _materialName: string
  private _material: Material
  private _vertices: Array<Vertex> = []

  /**
   * Creates a new sprite.
   * @param name The name of this sprite.
   * @param materialName The name of the material to use with this sprite.
   */
  public constructor(name: string, materialName: string) {
    this._name = name
    this._materialName = materialName
    this._material = MaterialManager.getMaterial(this._materialName)
  }

  /** The name of this sprite. */
  public get name(): string {
    return this._name
  }

  /** The width of this sprite. */
  public get width(): number {
    return this._width
  }

  /** The height of this sprite. */
  public get height(): number {
    return this._height
  }

  /** Performs destruction routines on this sprite. */
  public destroy(): void {
    if (this._buffer)
      this._buffer.destroy()
    if (!this._material)
      return undefined
    MaterialManager.releaseMaterial(this._materialName)
    this._material = undefined
    this._materialName = undefined
  }

  /** Performs loading routines on this sprite. */
  public load(): void {
    this._buffer = new GLBuffer()

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0
    positionAttribute.size = 3
    this._buffer.addAttributeLocation(positionAttribute)

    const texCoordAttribute = new AttributeInfo()
    texCoordAttribute.location = 1
    texCoordAttribute.size = 2
    this._buffer.addAttributeLocation(texCoordAttribute)

    this.calculateVertices()
  }

  /**
   * Draws this sprite.
   * @param model The model matrix to be applied.
   * @param view The view matrix to be applied.
   * @param projection The projection matrix to be applied.
   */
  public draw(model: Matrix, view: Matrix, projection: Matrix): void {
    if (this._material.diffuseTexture && this._width !== this._material.diffuseTexture.width && this._height !== this._material.diffuseTexture.height)
      this.calculateVertices()
    this._material.apply(model, view, projection)

    this._buffer.bind()
    this._buffer.draw()
  }

  /** Calculates the vertices for this sprite. */
  private calculateVertices(): void {
    this._width = this._material.diffuseTexture.width
    this._height = this._material.diffuseTexture.height

    const minX = -this._width / 2
    const maxX = this._width / 2

    const minY = -this._height /2
    const maxY = this._height / 2

    this._vertices = [
      //          x     y     z    u    v
      new Vertex(minX, minY, 0.0, 0.0, 0.0),
      new Vertex(minX, maxY, 0.0, 0.0, 1.0),
      new Vertex(maxX, maxY, 0.0, 1.0, 1.0),

      new Vertex(maxX, maxY, 0.0, 1.0, 1.0),
      new Vertex(maxX, minY, 0.0, 1.0, 0.0),
      new Vertex(minX, minY, 0.0, 0.0, 0.0)
    ]

    this._buffer.clearData()
    this._vertices.forEach(vertice => this._buffer.pushBackData(vertice.toArray()))
    this._buffer.uplaod()
    this._buffer.unbind()
  }
}