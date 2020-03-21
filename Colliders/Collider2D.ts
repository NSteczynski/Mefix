import Vector2 from '../Maths/Vector2'
import Utilities from '../WebGL/Utilities'
import AttributeInfo from '../WebGL/AttributeInfo'
import Message from '../Messages/Message'
import Matrix from '../Maths/Matrix'
import Buffer from '../WebGL/Buffer'
import Component from '../Components/Component'
import Material from '../Graphics/Material'
import ShaderManager from '../Shaders/ShaderManager'
import BuiltinShader from '../Shaders/BuiltinShader'
import Color from '../Graphics/Color'
import MaterialManager from '../Graphics/MaterialManager'
import ColliderManager2D from './ColliderManager2D'
import MESSAGE_ASSET_LOADER_ASET_LOADED from '../Assets/AssetMessage'

export default abstract class Collider2D extends Component {
  protected _offset: Vector2
  protected _buffer: Buffer
  protected _vertices: Array<Vector2>
  protected _material: Material

  /**
   * Creates a new Collider2D
   * @param offset The offset of the collider.
   */
  public constructor(offset: Vector2 = Vector2.zero) {
    super()
    this._offset = offset
    this._material = new Material('defaultMaterial', ShaderManager.getShader(BuiltinShader.BASIC), 'assets/defaultMaterial.svg', Color.green())
    MaterialManager.registerMaterial(this._material)
    ColliderManager2D.register(this)
  }

  /** The offset of the collider. */
  public get offset(): Vector2 {
    return this._offset
  }

  /** The offset of the collider. */
  public set offset(value: Vector2) {
    this._offset = value
    this.calculateVertices()
  }

  public start(): void {
    this._buffer = new Buffer(Utilities.webGL.FLOAT, Utilities.webGL.ARRAY_BUFFER, Utilities.webGL.LINES)

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0
    positionAttribute.size = 2
    this._buffer.addAttributeLocation(positionAttribute)

    if (!this._material.diffuseTexture.isLoaded)
      return Message.subscribe(MESSAGE_ASSET_LOADER_ASET_LOADED + this._material.diffuseTexture.name, this.calculateVertices.bind(this))
    return this.calculateVertices()
  }

  public render(view: Matrix, projection: Matrix): void {
    if (!this._material.diffuseTexture.isLoaded)
      return undefined
    this._material.apply(this.owner.worldMatrix, view, projection)

    this._buffer.bind()
    this._buffer.draw()
  }

  public onCollisionEnter2D(collider: Collider2D): void {
    this._material.tint = Color.red()
  }

  public onCollisionStay2D(collider: Collider2D): void {
    if (this._material.tint !== Color.red())
      this._material.tint = Color.red()
  }

  public onCollisionExit2D(collider: Collider2D): void {
    this._material.tint = Color.green()
  }

  protected calculateVertices(): void {
    this._buffer.clearData()
    this._vertices.map(vertice => this._buffer.pushBackData(vertice.toArray()))
    this._buffer.upload()
    this._buffer.unbind()
  }
}