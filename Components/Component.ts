import GameObject from '../World/GameObject'
import Matrix from '../Maths/Matrix'
import Collider from '../Colliders/Collider'
import Collider2D from '../Colliders/Collider2D'
import Transform from '../Maths/Transform'

export default abstract class Component {
  /** The owning game object. */
  public owner: GameObject
  /** The name of component. */
  public readonly name: string

  /** Creates a new Component */
  public constructor() {
    this.name = Object.getPrototypeOf(this).constructor.name
  }

  /** The owner transform. */
  public get transform(): Transform {
    return this.owner.transform
  }

  /** It is called only once on start. */
  public start(): void {}

  /** It is called once per frame. */
  public update(): void {}

  /** It is called once per frame. */
  public render(view: Matrix, projection: Matrix): void {}
}