import Matrix from '../Math/Matrix'
import GameObject from '../Entities/GameObject'

export default class Component {
  /** The owning game object. */
  public owner: GameObject

  /** The name of component. */
  public name: string

  /**
   * Creates a new Component
   * @param name The name of component.
   */
  public constructor(name: string) {
    this.name = name
  }

  /** It is called only once on start and if component is enabled. */
  public start(): void {

  }

  /** It is called once per frame. */
  public update(): void {

  }

  public render(view: Matrix, projection: Matrix): void {
    
  }
}