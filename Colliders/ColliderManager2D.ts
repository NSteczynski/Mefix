import Collider2D from './Collider2D'
import PolygonCollider2D from './2D/PolygonCollider2D'
import CircleCollider2D from './2D/CircleCollider2D'
import Vector2 from '../Maths/Vector2'
import BoxCollider2D from './2D/BoxCollider2D'

export default abstract class ColliderManager {
  private static _collisionData: Array<CollisionData> = []
  private static _colliders: Array<Collider2D> = []

  /** Performs update routines on collider manager. */
  public static update(): void {
    this._colliders.map(collider => {
      this._colliders.map(checkCollider => {
        if (collider === checkCollider)
          return undefined
        if (collider.owner === checkCollider.owner)
          return undefined

        const intersects = this.intersects(collider, checkCollider)
        const previousCollision = this._collisionData.findIndex(data => data.colliderA === collider && data.colliderB === checkCollider)

        if (!intersects && previousCollision >= 0)
          return this.removeData(previousCollision)
        if (previousCollision >= 0)
          return undefined
        if (!intersects)
          return undefined
        this._collisionData.push(new CollisionData(collider, checkCollider))
      })
    })

    this._collisionData.map(data => data.stay())
  }

  /** Registers new collider to the collider manager. */
  public static register(collider: Collider2D): void {
    this._colliders.push(collider)
  }

  /** Unregisters collider from the collider manager */
  public static unregister(collider: Collider2D): void {
    this._collisionData = this._collisionData.filter(data => data.colliderA !== collider)
    this._colliders = this._colliders.filter(col => col !== collider)
  }

  private static removeData(index: number) {
    const data = this._collisionData[index]
    this._collisionData.splice(index, 1)
    data.exit()
  }

  private static intersects(collider: Collider2D, checkCollider: Collider2D): boolean {
    if ((collider instanceof PolygonCollider2D || collider instanceof BoxCollider2D) && (checkCollider instanceof PolygonCollider2D || checkCollider instanceof BoxCollider2D))
      return this.checkPolyPoly(collider, checkCollider)
    if ((collider instanceof PolygonCollider2D || collider instanceof BoxCollider2D) && checkCollider instanceof CircleCollider2D)
      return this.checkPolyCircle(collider, checkCollider)
    if (collider instanceof CircleCollider2D && (checkCollider instanceof PolygonCollider2D || checkCollider instanceof BoxCollider2D))
      return this.checkPolyCircle(checkCollider, collider)
    if (collider instanceof CircleCollider2D && checkCollider instanceof CircleCollider2D)
      return this.checkCircleCircle(collider, checkCollider)
    return false
  }

  private static checkPolyPoly(collider: PolygonCollider2D | BoxCollider2D, checkCollider: PolygonCollider2D | BoxCollider2D): boolean {
    const compPoints = collider.points.map(point => this.pointToWorld(point, collider))
    const checkPoints = checkCollider.points.map(point => this.pointToWorld(point, checkCollider))

    const compAxes = compPoints.map((point, index) => {
      const nextIndex = index + 1 === compPoints.length ? 0 : index + 1
      return point.axis(compPoints[nextIndex])
    })

    const checkAxes = checkPoints.map((point, index) => {
      const nextIndex = index + 1 === checkPoints.length ? 0 : index + 1
      return point.axis(checkPoints[nextIndex])
    })

    const axes = compAxes.concat(checkAxes)
    return axes.every(axis => {
      const compDefaultMin = axis.x * compPoints[0].x + axis.y * compPoints[0].y
      const [compMin, compMax] = compPoints.reduce((r, point) => {
        return point.project(axis, r[0], r[1])
      }, [compDefaultMin, compDefaultMin])

      const checkDefaultMin = axis.x * checkPoints[0].x + axis.y * checkPoints[0].y
      const [checkMin, checkMax] = checkPoints.reduce((r, point) => {
        return point.project(axis, r[0], r[1])
      }, [checkDefaultMin, checkDefaultMin])

      return compMin <= checkMax && checkMin <= compMax
    })
  }

  private static checkPolyCircle(collider: PolygonCollider2D | BoxCollider2D, checkCollider: CircleCollider2D): boolean {
    const checkOffsetMultiplier = new Vector2(checkCollider.radius * 2, checkCollider.radius * 2)
    const checkCenter = this.pointToWorld(checkCollider.offset.multiply(checkOffsetMultiplier), checkCollider)
    if (this.checkPolyPoint(collider, checkCenter))
      return true
    const compPoints = collider.points.map(point => this.pointToWorld(point, collider))
    return compPoints.some((point, index) => {
      const nextIndex = index + 1 === collider.points.length ? 0 : index + 1
      const ap = checkCenter.substract(point)
      const ab = compPoints[nextIndex].substract(point)
      const magnitudeAB = ab.x * ab.x + ab.y * ab.y
      const dot = ap.x * ab.x + ap.y * ab.y
      const normal = dot / magnitudeAB
      const vector = normal < 0 ? point : normal > 1 ? compPoints[nextIndex] : new Vector2(point.x + ab.x * normal, point.y + ab.y * normal)
      const scale = checkCollider.owner.worldScale.x > checkCollider.owner.worldScale.y ? checkCollider.owner.worldScale.x : checkCollider.owner.worldScale.y
      return vector.distance(checkCenter) < checkCollider.radius * scale
    })
  }

  private static checkCircleCircle(collider: CircleCollider2D, checkCollider: CircleCollider2D): boolean {
    const compOffsetMultiplier = new Vector2(collider.radius * 2, collider.radius * 2)
    const compCenter = this.pointToWorld(collider.offset.multiply(compOffsetMultiplier), collider)
    const compScale = collider.owner.transform.scale.x > collider.owner.transform.scale.y ? collider.owner.transform.scale.x : collider.owner.transform.scale.y
    const checkOffsetMultiplier = new Vector2(checkCollider.radius * 2, checkCollider.radius * 2)
    const checkCenter = this.pointToWorld(checkCollider.offset.multiply(checkOffsetMultiplier), checkCollider)
    const checkScale = checkCollider.owner.transform.scale.x > checkCollider.owner.transform.scale.y ? checkCollider.owner.transform.scale.x : checkCollider.owner.transform.scale.y
    const distance = compCenter.distance(checkCenter)
    return distance < collider.radius * compScale + checkCollider.radius * checkScale
  }

  private static checkPolyPoint(collider: PolygonCollider2D | BoxCollider2D, point: Vector2): boolean {
    const compPoints = collider.points.map(point => this.pointToWorld(point, collider))
    const axes = compPoints.map((point, index) => {
      const nextIndex = index + 1 === collider.points.length ? 0 : index + 1
      return point.axis(compPoints[nextIndex])
    })

    return axes.every(axis => {
      const compDefaultMin = axis.x * compPoints[0].x + axis.y * compPoints[0].y
      const [compMin, compMax] = compPoints.reduce((r, point) => {
        return point.project(axis, r[0], r[1])
      }, [compDefaultMin, compDefaultMin])

      const pointMinMax = axis.x * point.x + axis.y * point.y
      return compMin <= pointMinMax && pointMinMax <= compMax
    })
  }

  private static pointToWorld(point: Vector2, collider: Collider2D): Vector2 {
    return point.multiply(collider.owner.worldScale).rotate(collider.owner.worldRotation).add(collider.owner.worldPosition)
  }
}

class CollisionData {
  public colliderA: Collider2D
  public colliderB: Collider2D

  public constructor(colliderA: Collider2D, colliderB: Collider2D) {
    this.colliderA = colliderA
    this.colliderB = colliderB
    this.enter()
  }

  /** Runs onColliderEnter2D. */
  public enter(): void {
    this.colliderA.onCollisionEnter2D(this.colliderB)
  }

  /** Runs onColliderStay2D. */
  public stay(): void {
    this.colliderA.onCollisionStay2D(this.colliderB)
  }

  /** Runs onColliderExit2D. */
  public exit(): void {
    this.colliderA.onCollisionExit2D(this.colliderB)
  }
}