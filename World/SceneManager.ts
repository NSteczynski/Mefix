import Dictionary from '../Core/Dictionary'
import Scene from './Scene'

/** Responsible for managing scenes. */
export default abstract class SceneManager {
  private static _scenes: Dictionary<Scene> = {}
  private static _activeScene: Scene

  /** Current active scene. */
  public static get activeScene(): Scene {
    return this._activeScene
  }

  /** Registers a new scene. */
  public static registerScene(scene: Scene): void {
    if (this._scenes[scene.id] !== undefined)
      return undefined
    this._scenes[scene.id] = scene
  }

  /**
   * Changes the active level to the one with the provided id.
   * @param id The id of the level to change to.
   */
  public static changeScene(id: number): void {
    if (!this._scenes[id])
      return undefined
    this._activeScene = this._scenes[id]
    this._activeScene.start()
  }
}