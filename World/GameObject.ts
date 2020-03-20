import Component from '../Components/Component'
import Matrix from '../Maths/Matrix'
import Transform from '../Maths/Transform'
import Vector3 from '../Maths/Vector3'

/** Represents a single object in the world. */
export default class GameObject {
  private _children: Array<GameObject> = []
  private _parent: GameObject
  private _components: Array<Component> = []

  private _localMatrix: Matrix = Matrix.identity()
  private _worldMatrix: Matrix = Matrix.identity()

  /** The name of object. */
  public name: string
  /** The transform of object. */
  public transform: Transform = new Transform()

  /**
   * Creates a new game object.
   * @param name The name of game object.
   */
  public constructor(name: string) {
    this.name = name
  }

  /** Returns the parent of game object. */
  public get parent(): GameObject {
    return this._parent
  }

  /** Returns the world transformation matrix of game object. */
  public get worldMatrix(): Matrix {
    return this._worldMatrix
  }

  /**
   * Adds the provided game object as a child of one.
   * @param child The child to be added.
   */
  public addChild(child: GameObject): void {
    child._parent = this
    this._children.push(child)
  }

  /**
   * Attempts to remove the provided game object as a child of one.
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
   * Recursively attempts to retrieve a component with the given name from game object.
   * @param name The name of the component to retrieve.
   */
  public getComponentByName(name: string): Component {
    return this._components.find(component => component.name === name)
  }

  /**
   * Recursively attempts to retrieve a child game object with the given name from game object or its children.
   * @param name The name of the game object to retrieve.
   */
  public getObjectByName(name: string): GameObject {
    if (this.name === name)
      return this
    return this._children.find(child => child.getObjectByName(name))
  }

  /**
   * Adds the given component to game object.
   * @param component The component to be added.
   */
  public addComponent(component: Component): void {
    this._components.push(component)
    component.owner = this
  }

  /** Performs start procedures on game object. */
  public start(): void {
    this._components.map(component => component.start())
    this._children.map(child => child.start())
  }

  /** Performs update procedures on game object. */
  public update(): void {
    this._localMatrix = this.transform.getTransformationMatrix()
    this.updateWorldMatrix()

    this._components.map(component => component.update())
    this._children.map(child => child.update())
  }

  /** Performs render procedures on game object. */
  public render(view: Matrix, projection: Matrix): void {
    this._components.map(component => component.render(view, projection))
    this._children.map(child => child.render(view, projection))
  }

  /** Returns the world position of game object. */
  public getWorldPosition(): Vector3 {
    return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14])
  }

  /** Returns the world scale of game object. */
  public getWorldScale(): Vector3 {
    const data = this._worldMatrix.data
    const scaleX = data[15] * Math.sqrt(Math.pow(data[0], 2) + Math.pow(data[1], 2) + Math.pow(data[2], 2))
    const scaleY = data[15] * Math.sqrt(Math.pow(data[4], 2) + Math.pow(data[5], 2) + Math.pow(data[6], 2))
    const scaleZ = data[15] * Math.sqrt(Math.pow(data[8], 2) + Math.pow(data[9], 2) + Math.pow(data[10], 2))
    return new Vector3(scaleX, scaleY, scaleZ)
  }

  /** Returns the world rotation of game object. */
  public getWorldRotation(): Vector3 {
    const data = this._worldMatrix.data
    const rotationX = Math.atan2(data[6], data[10])
    const rotationY = Math.atan2(-data[2], Math.sqrt(Math.pow(data[0], 2) + Math.pow(data[1], 2)))
    const rotationZ = Math.atan2(Math.sin(rotationX) * data[8] - Math.cos(rotationX) * data[4], Math.cos(rotationX) * data[5] - Math.sin(rotationX) * data[9])
    return new Vector3(rotationX, rotationY, rotationZ)
  }

  private updateWorldMatrix(): void {
    if (this._parent !== undefined)
      this._worldMatrix = Matrix.multiply(this._parent.worldMatrix, this._localMatrix)
    else
      this._worldMatrix = this._localMatrix
  }
}