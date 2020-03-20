import Component from '../Component'
import Sprite from '../../Graphics/Sprite'
import ShaderManager from '../../Shaders/ShaderManager'
import BuiltinShader from '../../Shaders/BuiltinShader'
import Material from '../../Graphics/Material'
import Color from '../../Graphics/Color'
import MaterialManager from '../../Graphics/MaterialManager'
import Matrix from '../../Maths/Matrix'

export default class SpriteRenderer extends Component {
  public readonly sprite: Sprite

  /**
   * Creates a new Sprite Renderer component.
   * @param path The path of the image.
   * @param color The color of the image. Default: WHITE
   */
  public constructor(path: string, color: Color = Color.white()) {
    super()
    const shader = ShaderManager.getShader(BuiltinShader.BASIC)
    const material = new Material(path, shader, path, color)
    MaterialManager.registerMaterial(material)
    this.sprite = new Sprite(path, path)
  }

  public start(): void {
    this.sprite.load()
  }

  public render(view: Matrix, projection: Matrix): void {
    this.sprite.draw(this.owner.worldMatrix, view, projection)
  }
}