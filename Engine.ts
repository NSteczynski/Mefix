import GLUtilities, { GL } from './WebGL/GLUtilities'
import Time from './Core/Time'
import AssetManager from './Assets/AssetManager'
import ShaderManager from './Shaders/ShaderManager'
import InputManager from './Input/InputManager'
import LevelManager from './World/LevelManager'
import ColliderManager from './Collisions/ColliderManager'
import MessageSender from './Message/MessageSender'

/** Demo */
import Demo from './Demo/Demo'

/** The game engine class. */
export default class Engine {
  private static _time: Time

  /** Prevent creating new class. */
  private constructor() {}

  public static initialize() {
    /** Create time element. */
    this._time = new Time()
    /** Create a new canvas element. */
    GLUtilities.initialize()

    /** Initialize managers. */
    AssetManager.initialize()
    ShaderManager.initialize()
    InputManager.initialize()

    /** Initialize Demo */
    Demo.initialize()

    /** Handle window resize. */
    window.onload = this.onResize
    window.onresize = this.onResize

    requestAnimationFrame(this.loop.bind(this))
  }

  private static onResize(): void {
    /** Update canvas width and height. */
    GLUtilities.canvas.width = window.innerWidth
    GLUtilities.canvas.height = window.innerHeight

    /** Active camera resize. */
    if (LevelManager.activeLevel === undefined || LevelManager.activeLevel.activeCamera === undefined)
      return undefined
    LevelManager.activeLevel.activeCamera.onResize()
  }

  private static loop(): void {
    requestAnimationFrame(this.loop.bind(this))
    if (LevelManager.activeLevel === undefined)
      return undefined

    /** Update Time delta time. */
    this._time.deltaTime()

    this.start()
    this.update()

    /** Update Time previous delta time. */
    this._time.prevDeltaTime()
  }

  private static start(): void {
    /** Start active level. */
    LevelManager.activeLevel.start()
  }

  private static update(): void {
    /** Update collisions. */
    ColliderManager.update()

    /** Update messages. */
    MessageSender.update()

    /** Update active level. */
    LevelManager.activeLevel.update()

    this.render()
  }

  private static render(): void {
    /** Reset WebGL color. */
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

    /** WebGL render black background if there is not active camera. */
    if (LevelManager.activeLevel.activeCamera === undefined)
      return GL.clearColor(0, 0, 0, 255)

    /** Render active camera. */
    LevelManager.activeLevel.activeCamera.render()
  }
}