import Component from '../Component'
import Color from '../../Graphics/Color'
import ProjectionType from '../../Core/ProjectionType'
import Matrix from '../../Maths/Matrix'
import Utilities from '../../WebGL/Utilities'
import SceneManager from '../../World/SceneManager'
import DefaultParam from '../../Core/DefaultParam'

const defaultBackground = new Color(146 / 255, 206 / 255, 247 / 255, 1.0)

export default class CameraComponent extends Component {
  public background: Color
  public projectionType: ProjectionType
  public near: number
  public far: number

  private _projection: Matrix = Matrix.identity()

  /**
   * Creates a new Camera Component.
   * @param background The background color of view. Default: Color(146 / 255, 206 / 255, 247 / 255, 1.0)
   * @param projectionType The projection type of camera. Default: ORTHOGRAPHIC
   * @param near The near distance to be rendered. Default: 0.1
   * @param far The far distance to be rendered. Default: 100
   */
  public constructor(background: Color = defaultBackground, projectionType: ProjectionType = ProjectionType.ORTHOGRAPHIC, near: number = 0.1, far: number = 100) {
    super()
    this.background = background
    this.projectionType = projectionType
    this.near = near
    this.far = far

    Utilities.webGL.enable(Utilities.webGL.BLEND)
    Utilities.webGL.blendFunc(Utilities.webGL.SRC_ALPHA, Utilities.webGL.ONE_MINUS_SRC_ALPHA)
    Utilities.webGL.enable(Utilities.webGL.DEPTH_TEST)
    Utilities.webGL.depthFunc(Utilities.webGL.LEQUAL)

    if (SceneManager.activeScene !== undefined)
      SceneManager.activeScene.registerCamera(this)
  }

  /** Resizes viewport to window size. */
  public onResize() {
    Utilities.webGL.viewport(0, 0, window.innerWidth, window.innerHeight)
  }

  /** Renders camera view. */
  public renderView(): void {
    this.updateView()
    Utilities.webGL.clearColor(this.background.r, this.background.g, this.background.b, this.background.a)
    // const reverseMatrix = Matrix.inverse(this.owner.worldMatrix)
    SceneManager.activeScene.render(Matrix.multiply(this.owner.worldMatrix, Matrix.scale(DefaultParam)), this._projection)
  }

  private updateView(): void {
    this._projection = Matrix.orthographic(-window.innerWidth / 2, window.innerWidth / 2, -window.innerHeight / 2, window.innerHeight / 2, this.near, this.far)
  }
}