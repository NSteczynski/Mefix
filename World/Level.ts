import CameraComponent from "../Components/Builtin/CameraComponent"
import GameObject from "../Entities/GameObject"
import Matrix from "../Math/Matrix"
import LevelManager from "./LevelManager"
import Scene from './Scene'
import { Dictionary, LevelState  } from "../Core/Types"

/**
 * Represents a single level in the world. Levels are loaded and unloaded as the player 
 * progresses through the game. An open world would be achieved by overriding this class
 * and adding/removing objects dynamically based on player position, etc.
 */
export default class Level {
  private static _GLOBAL_LEVEL_ID: number = 0

  private _id: number
  private _name: string
  private _description: string
  private _scene: Scene
  private _state: LevelState = LevelState.UNINITIALIZED
  private _registeredCameras: Dictionary<CameraComponent> = {}
  private _activeCamera: CameraComponent

  /**
   * Creates a new level.
   * @param name The name of this level.
   * @param description A brief description of this level. 
   * Could be used on level selection screens for some games.
   */
  public constructor(name: string, description: string) {
    this._id = Level._GLOBAL_LEVEL_ID++
    this._name = name
    this._description = description
    this._scene = new Scene()

    LevelManager.registerLevel(this)
  }

  public get id(): number {
    return this._id
  }

  /** The name of this level. */
  public get name(): string {
    return this._name
  }

  /** The description of this level. */
  public get description(): string {
    return this._description
  }

  /** The currently active camera. */
  public get activeCamera(): CameraComponent {
    return this._activeCamera
  }

  /** Indicates if this level is loaded. */
  public get isLoaded(): boolean {
    return this._state === LevelState.UPDATING
  }

  public addObject(object: GameObject): void {
    this._scene.addObject(object)
  }

  public load(): void {
    this._state = LevelState.LOADING

    const cameraKeys = Object.keys(this._registeredCameras)
    if (cameraKeys.length > 0)
      this._activeCamera = this._registeredCameras[cameraKeys[0]]

    this._state = LevelState.UPDATING
  }

  /** Unloads this level. */
  public unload(): void {
    
  }

  public start(): void {
    this._scene.start()
  }

  /** Updates this level. */
  public update(): void {
    if (this._state === LevelState.UPDATING)
      this._scene.update()
  }

  public render(view: Matrix, projection: Matrix): void {
    if (this._state === LevelState.UPDATING)
      this._scene.render(view, projection)
  }

  /** Called when this level is activated. */
  public onActivated(): void {

  }

  /** Called when this level is deactivated. */
  public onDeactivated(): void {

  }

  /**
   * Registers the provided camera with this level. Automatically sets as the active camera
   * if no active camera is currently set.
   * @param camera The camera to register.
   */
  public registerCamera(camera: CameraComponent): void {
    if (this._registeredCameras[camera.name] !== undefined)
      return console.warn("A camera named '" + camera.name + "' has already been registered. New camera not registered.")
    this._registeredCameras[camera.name] = camera
    this._activeCamera = camera
  }

  /**
   * Unregisters the provided camera with this level.
   * @param camera The camera to unregister.
   */
  public unregisterCamera(camera: CameraComponent): void {
    if (this._registeredCameras[camera.name] !== undefined)
      return console.warn("No camera named '" + camera.name + "' hsd been registered. Camera not unregistered.")
    this._registeredCameras[camera.name] = undefined
    if (this._activeCamera === camera)
      this._activeCamera = undefined
  }
}