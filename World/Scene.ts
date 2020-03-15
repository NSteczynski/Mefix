import GameObject from "../Entities/GameObject"
import Matrix from "../Math/Matrix"

/** A scene graph, which is responsible for managing the heirarchy of objects in a scene (essentially, it is the scene itself). */
export default class Scene {
  private _root: GameObject
  private _isLoaded: boolean = false

  public constructor() {
    this._root = new GameObject('__ROOT__', this)
  }

  /** Returns the root object. */
  public get root(): GameObject {
    return this._root
  }

  /** Indicates if this scene is loaded. */
  public get isLoaded(): boolean {
    return this._isLoaded
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

  /** Starts this scene. */
  public start(): void {
    this._root.start()
    this._isLoaded = true
  }

  /**
   * Performs update procedures on this scene.
   */
  public update(): void {
    this._root.update()
  }

  public render(view: Matrix, projection: Matrix): void {
    this._root.render(view, projection)
  }
}