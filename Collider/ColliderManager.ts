import Collider from './Collider'
import Collider2D from './Collider2D'

export default abstract class ColliderManager {
  private static _collisionData: Array<CollisionData> = []
  private static _colliders: Array<Collider> = []

  /** Performs update routines on collider manager. */
  public static update(): void {
    this._colliders.map(collider => {
      this._colliders.map(checkCollider => {
        if (collider === checkCollider)
          return undefined
        if (collider.owner === checkCollider.owner)
          return undefined

        const intersects = collider.intersects(checkCollider)
        const previousCollision = this._collisionData.findIndex(data => data.colliderA === collider && data.colliderB === checkCollider)

        if (!intersects && previousCollision)
          return undefined
        if (previousCollision >= 0)
          return undefined
        if (!intersects)
          return undefined
        
      })
    })
  }

  /** Registers new collider to the collider manager. */
  public static register(collider: Collider): void {
    this._colliders.push(collider)
  }

  /** Unregisters collider from the collider manager */
  public static unregister(collider: Collider): void {
    this._collisionData = this._collisionData.filter(data => data.colliderA !== collider)
    this._colliders = this._colliders.filter(col => col !== collider)
  }
}

class CollisionData {
  public colliderA: Collider
  public colliderB: Collider

  public constructor(colliderA: Collider, colliderB: Collider) {
    this.colliderA = colliderA
    this.colliderB = colliderB
  }
}