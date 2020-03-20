import Component from '../Components/Component'
import Buffer from '../WebGL/Buffer'
import Material from '../Graphics/Material'
import MaterialManager from '../Graphics/MaterialManager'
import ShaderManager from '../Shaders/ShaderManager'
import BuiltinShader from '../Shaders/BuiltinShader'
import Color from '../Graphics/Color'
import ColliderManager from './ColliderManager'
import Vector3 from '../Maths/Vector3'

export default abstract class Collider extends Component {
  protected _buffer: Buffer
  protected _vertices: Array<Vector3>
  protected _material: Material

  /**
   * Creates a new Collider.
   * @param name The name of the collider.
   */
  public constructor() {
    super()
    const shader = ShaderManager.getShader(BuiltinShader.BASIC)
    this._material = new Material('defaultMaterial', shader, 'assets/defaultMaterial.svg', Color.green())
    MaterialManager.registerMaterial(this._material)
    ColliderManager.register(this)
  }

  /** Checks if collider intersects with provided collider. */
  public abstract intersects(collider: Collider): boolean

  public onCollisionEnter(collider: Collider): void {
    this._material.tint = Color.red()
  }

  public onCollisionStay(collider: Collider): void {
    if (this._material.tint !== Color.red())
      this._material.tint = Color.red()
  }

  public onCollisionExit(collider: Collider): void {
    this._material.tint = Color.green()
  }
}