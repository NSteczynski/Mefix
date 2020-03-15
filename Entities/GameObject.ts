import Component from "../Components/Component"
import Matrix from "../Math/Matrix"
import Transform from '../Math/Transform'
import CameraComponent from "../Components/Builtin/CameraComponent"
import Vector3 from "../Math/Vector3"
import Scene from '../World/Scene'

/**
 * Represents a single entity in the world. TEntities themselves do not get rendered or have behaviors.
 * The do, however, have transforms and may have child TEntities. Components and behaviors may be
 * attached to TEntities to decorate functionality.
 */
export default class GameObject {
  private _children: Array<GameObject> = []
  private _parent: GameObject
  private _scene: Scene
  private _components: Array<Component> = []
  private _isEnabled: boolean = true

  private _localMatrix: Matrix = Matrix.identity()
  private _worldMatrix: Matrix = Matrix.identity()

  /** The name of this object. */
  public name: string
  /** The transform of this entity. */
  public transform: Transform = new Transform()

  /**
   * Creates a new game object.
   * @param name The name of this game object.
   * @param scene The scene to which this game object belongs.
   */
  public constructor(name: string, scene?: Scene) {
    this.name = name
    this._scene = scene
  }

  /** Returns the parent of this game object. */
  public get parent(): GameObject {
    return this._parent
  }

  /** Returns the world transformation matrix of this game object. */
  public get worldMatrix(): Matrix {
    return this._worldMatrix
  }

  /** Indicates if this game object is currently visible. */
  public get isEnabled(): boolean {
    return this._isEnabled
  }

  /** Sets visibility of this game object. */
  public set isEnabled(value: boolean) {
    this._isEnabled = value
  }

  /**
   * Adds the provided game object as a child of this one.
   * @param child The child to be added.
   */
  public addChild(child: GameObject): void {
    child._parent = this
    this._children.push(child)
    child.onAdded(this._scene)
  }

  /**
   * Attempts to remove the provided game object as a child of this one, if it is in fact 
   * a child of this entity. Otherwise, nothing happens.
   * @param child The child to be removed.
   */
  public removeChild(child: GameObject): void {
    const index = this._children.indexOf(child)
    if (index < 0)
      return undefined
    child._parent = undefined
    this._children.splice(index, 1)
  }

  /**
   * Recursively attempts to retrieve a component with the given name from this game object.
   * @param name The name of the component to retrieve.
   */
  public getComponentByName(name: string): Component {
    return this._components.find((component: Component) => component.name === name)
  }

  /**
   * Recursively attempts to retrieve a child game object with the given name from this game object or its children.
   * @param name The name of the game object to retrieve.
   */
  public getObjectByName(name: string): GameObject {
    if (this.name === name)
      return this
    return this._children.find((child: GameObject) => child.getObjectByName(name))
  }

  /**
   * Adds the given component to this game object.
   * @param component The component to be added.
   */
  public addComponent(component: Component): void {
    this._components.push(component)
    component.owner = this
  }

  /** Performs start procedures on game object. */
  public start(): void {
    this._components.forEach(component => component.start())
    this._children.forEach(child => child.isEnabled && child.start())
  }

  /**
   * Performs update procedures on this game object (recurses through children, 
   * components and behaviors as well).
   */
  public update(): void {
    this._localMatrix = this.transform.getTransformationMatrix()
    this.updateWorldMatrix(this._parent !== undefined ? this._parent.worldMatrix : undefined)

    this._components.forEach(component => component.update())
    this._children.forEach(child => child.update())
  }

  public render(view: Matrix, projection: Matrix): void {
    this._components.forEach(component => !(component instanceof CameraComponent) && component.render(view, projection))
    this._children.forEach(child => child.render(view, projection))
  }

  /** Returns the world position of this game object. */
  public getWorldPosition(): Vector3 {
    return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14])
  }

  /**
   * Called when this game object is added to a scene.
   * @param scene The scene to which this game object was added.
   */
  protected onAdded(scene: Scene): void {
    this._scene = scene
  }

  private updateWorldMatrix(parentWorldMatrix: Matrix): void {
    if (parentWorldMatrix !== undefined)
      this._worldMatrix = Matrix.multiply(parentWorldMatrix, this._localMatrix)
    else
      this._worldMatrix = this._localMatrix
  }
}