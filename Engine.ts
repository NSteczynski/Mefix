import Utilities from './WebGL/Utilities'
import AssetManager from './Assets/AssetManager'
import ShaderManager from './Shaders/ShaderManager'
import InputManager from './Input/InputManager'
import SceneManager from './World/SceneManager'
import MessageSender from './Messages/MessageSender'
import ColliderManager from './Collider/ColliderManager'
import ColliderManager2D from './Collider/ColliderManager2D'

/** Demo */
import Demo from './Demo/Demo'
import Time from './Core/Time'

/** Responsible for logic, starting, updating and rendering. */
export default abstract class Engine {
  private static _time: Time = new Time()

  /** Initializes engine and all managers. */
  public static initialize(): void {
    Utilities.initialize()
    AssetManager.initialize()
    ShaderManager.initialize()
    InputManager.initialize()

    Demo.initialize()

    /** Handle window resize. */
    this.onResize()
    window.onload = this.onResize
    window.onresize = this.onResize

    requestAnimationFrame(this.loop.bind(this))
  }

  private static onResize(): void {
    Utilities.canvas.width = window.innerWidth
    Utilities.canvas.height = window.innerHeight

    if (SceneManager.activeScene.activeCamera !== undefined)
      SceneManager.activeScene.activeCamera.onResize()
  }

  private static loop(): void {
    requestAnimationFrame(this.loop.bind(this))
    this._time.checkDelta()

    if (SceneManager.activeScene === undefined)
      return undefined

    this.update()
    this.render()
    this._time.checkPrevDelta()
  }

  private static update(): void {
    ColliderManager.update()
    ColliderManager2D.update()
    MessageSender.update()
    SceneManager.activeScene.update()
  }

  private static render(): void {
    Utilities.webGL.clear(Utilities.webGL.COLOR_BUFFER_BIT | Utilities.webGL.DEPTH_BUFFER_BIT)
    if (SceneManager.activeScene.activeCamera === undefined)
      return Utilities.webGL.clearColor(0, 0, 0, 255)
    SceneManager.activeScene.activeCamera.renderView()
  }
}