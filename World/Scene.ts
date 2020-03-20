import GameObject from './GameObject'
import Matrix from '../Maths/Matrix'
import SceneManager from './SceneManager'
import CameraComponent from '../Components/Builtin/CameraComponent'
import Dictionary from '../Core/Dictionary'
import Camera from '../World/Camera'

export default class Scene {
  private static _GLOBAL_SCENE_ID: number = 0

  private _root: GameObject
  private _registeredCameras: Dictionary<CameraComponent> = {}
  private _activeCamera: CameraComponent

  /** The id of the scene. */
  public readonly id: number
  /** The name of the scene. */
  public readonly name: string

  /**
   * Creates a new Scene.
   * @param name The name of the scene.
   */
  public constructor(name: string) {
    this.id = Scene._GLOBAL_SCENE_ID++
    this.name = name
    this._root = new GameObject('__ROOT__')

    const camera = new Camera('MainCamera')
    const cameraComponent = camera.getComponentByName('CameraComponent') as CameraComponent
    this.registerCamera(cameraComponent)
    this.addObject(camera)
    SceneManager.registerScene(this)
  }

  /** The current active camera. */
  public get activeCamera(): CameraComponent {
    return this._activeCamera
  }

  /**
   * Adds an entity to the root entity of this scene.
   * @param object The entity to be added.
   */
  public addObject(object: GameObject): void {
    this._root.addChild(object)
  }

  /**
   * Recursively searches this scene graph for an entity with the provided name.
   * @param name The name of the entity to retrieve.
   */
  public getObjectByName(name: string): GameObject {
    return this._root.getObjectByName(name)
  }

  /** Performs start of the scene. */
  public start(): void {
    this._root.start()
  }

  /** Performs update of the scene. */
  public update(): void {
    this._root.update()
  }

  /** Performs render of the scene. */
  public render(view: Matrix, projection: Matrix): void {
    this._root.render(view, projection)
  }

  /**
   * Registers the provided camera with this level. Automatically sets as the active camera
   * if no active camera is currently set.
   * @param camera The camera to register.
   */
  public registerCamera(camera: CameraComponent): void {
    if (this._registeredCameras[camera.owner.name] !== undefined)
      return console.warn("A camera named '" + camera.owner.name + "' has already been registered. New camera not registered.")
    this._registeredCameras[camera.name] = camera
    if (this._activeCamera === undefined)
      this._activeCamera = camera
  }
}