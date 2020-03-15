import Behaviour from '../Behaviour'
import Color from '../../Graphics/Color'
import Matrix from '../../Math/Matrix'
import LevelManager from '../../World/LevelManager'
import { GL } from '../../WebGL/GLUtilities'
import { ProjectionType } from "../../Core/Types"

export default class CameraComponent extends Behaviour {
  private _background: Color
  private _prevBackground: Color
  private _projectionType: ProjectionType
  private _size: number
  private _near: number
  private _far: number

  private _shouldUpdateView: boolean = true
  private _projection: Matrix = Matrix.identity()

  public constructor(background: Color = defaultBackgound, projectionType: ProjectionType = ProjectionType.ORTHOGRAPHIC, size: number = 2, near: number = 0.1, far: number = 100.0, isEnabled?: boolean) {
    super('Camera', isEnabled)
    this._background = background
    this._projectionType = projectionType
    this._size = size
    this._near = near
    this._far = far

    GL.enable(GL.BLEND)
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)
    GL.enable(GL.DEPTH_TEST)
    GL.depthFunc(GL.LEQUAL)

    if (LevelManager.activeLevel)
      LevelManager.activeLevel.registerCamera(this)
  }

  public get background(): Color {
    return this._background
  }

  public set background(color: Color) {
    this._prevBackground = this._background
    this._background = color
    this._shouldUpdateView = true
  }

  public get projectionType(): ProjectionType {
    return this._projectionType
  }

  public set projectionType(projectionType: ProjectionType) {
    this._projectionType = projectionType
    this._shouldUpdateView = true
  }

  public get size(): number {
    return this._size
  }

  public set size(size: number) {
    this._size = size
    this._shouldUpdateView = true
  }

  public get near(): number {
    return this._near
  }

  public set near(near: number) {
    this._near = near
    this._shouldUpdateView = true
  }

  public get far(): number {
    return this._far
  }

  public set far(far: number) {
    this._far = far
    this._shouldUpdateView = true
  }

  public onResize() {
    GL.viewport(0, 0, window.innerWidth, window.innerHeight)
    this._shouldUpdateView = true
  }

  public getCameraView(): Matrix {
    if (this._shouldUpdateView)
      this.updateView()
    return Matrix.multiply(this.owner.worldMatrix, this._projection)
  }

  public render(): void {
    if (this._prevBackground !== this._background)
      this.updateBackground()
    if (this._shouldUpdateView)
      this.updateView()
    const reverseMatrix = Matrix.inverse(this.owner.worldMatrix)
    LevelManager.activeLevel.render(reverseMatrix, this._projection)
  }

  private updateView(): void {
    this._projection = Matrix.orthographic(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, this._near, this._far)
    this._shouldUpdateView = false
  }

  private updateBackground(): void {
    this._prevBackground = this._background
    const { r, g, b, a } = this._background
    GL.clearColor(r, g, b, a)
  }
}

const defaultBackgound = new Color(146 / 255, 206 / 255, 247 / 255, 1.0)