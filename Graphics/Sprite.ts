import Buffer from '../WebGL/Buffer'
import AttributeInfo from '../WebGL/AttributeInfo'
import Material from './Material'
import Vertex from './Vertex'
import MaterialManager from './MaterialManager'
import Matrix from '../Maths/Matrix'
import Message from '../Messages/Message'
import MESSAGE_ASSET_LOADER_ASET_LOADED from '../Assets/AssetMessage'
import DefaultParam from '../Core/DefaultParam'

/** Represents a sprite. */
export default class Sprite {
  private _name: string

  private _buffer: Buffer
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
    this._buffer = new Buffer()

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0
    positionAttribute.size = 3
    this._buffer.addAttributeLocation(positionAttribute)

    const texCoordAttribute = new AttributeInfo()
    texCoordAttribute.location = 1
    texCoordAttribute.size = 2
    this._buffer.addAttributeLocation(texCoordAttribute)

    if (!this._material.diffuseTexture.isLoaded)
      return Message.subscribe(MESSAGE_ASSET_LOADER_ASET_LOADED + this._material.diffuseTexture.name, this.calculateVertices.bind(this))
    return this.calculateVertices()
  }

  /**
   * Draws this sprite.
   * @param model The model matrix to be applied.
   * @param view The view matrix to be applied.
   * @param projection The projection matrix to be applied.
   */
  public draw(model: Matrix, view: Matrix, projection: Matrix): void {
    if (!this._material.diffuseTexture.isLoaded)
      return undefined
    this._material.apply(model, view, projection)

    this._buffer.bind()
    this._buffer.draw()
  }

  /** Calculates the vertices for this sprite. */
  private calculateVertices(): void {
    const width = this._material.diffuseTexture.width / DefaultParam.x
    const height = this._material.diffuseTexture.height / DefaultParam.y

    this._vertices = [
      new Vertex(-width, -height, 0.0, 0.0, 1.0),
      new Vertex(-width,  height, 0.0, 0.0, 0.0),
      new Vertex( width,  height, 0.0, 1.0, 0.0),

      new Vertex( width,  height, 0.0, 1.0, 0.0),
      new Vertex( width, -height, 0.0, 1.0, 1.0),
      new Vertex(-width, -height, 0.0, 0.0, 1.0)
    ]

    this._buffer.clearData()
    this._vertices.map(vertice => this._buffer.pushBackData(vertice.toArray()))
    this._buffer.upload()
    this._buffer.unbind()
  }
}