import Component from './Component'
import Collider from '../Colliders/Collider'
import Collider2D from '../Colliders/Collider2D'

export default abstract class Behaviour extends Component {
  /** It is called when collider has entered in collision with another collider. */
  public onColliderEnter(collider: Collider): void {}

  /** It is called when collider 2D has entered in collision with another collider 2D. */
  public onColliderEnter2D(collider: Collider2D): void {}

  /** It is called when collider stay in collision with another collider. */
  public onColliderStay(collider: Collider): void {}

  /** It is called when collider 2D stay in collision with another collider 2D. */
  public onColliderStay2D(collider: Collider2D): void {}

  /** It is called when collider leaves collision with another collider. */
  public onColliderExit(collider: Collider): void {}

  /** It is called when collider 2D leaves collision with another collider 2D. */
  public onColliderExit2D(collider: Collider2D): void {}
}