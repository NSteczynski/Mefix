import Scene from '../World/Scene'
import SceneManager from '../World/SceneManager'
import GameObject from '../World/GameObject'
import BoxCollider2D from '../Collider/2D/BoxCollider2D'
import CircleCollider2D from '../Collider/2D/CircleCollider2D'
import PolygonCollider2D from '../Collider/2D/PolygonCollider2D'
import SpriteRenderer from '../Components/Builtin/SpriteRenderer'
import Vector2 from '../Maths/Vector2'
import Vector3 from '../Maths/Vector3'
import Movement from './Movement'

export default abstract class Demo {
  public static initialize() {
    const scene = new Scene('demoScene')

    const player = new GameObject('player')
    player.addComponent(new Movement())
    // player.addComponent(new SpriteRenderer('assets/grass.svg'))
    player.addComponent(new CircleCollider2D(.5, new Vector2(0, 0)))
    player.addComponent(new PolygonCollider2D())
    scene.addObject(player)

    const square = new GameObject('square')
    square.transform.position.x = -1
    square.addComponent(new BoxCollider2D())
    scene.addObject(square)

    // const circle = new GameObject('circle')
    // circle.transform.position.y = 1
    // circle.addComponent(new CircleCollider2D())
    // scene.addObject(circle)

    // const polygon = new GameObject('polygon')
    // polygon.transform.position.x = 1
    // polygon.addComponent(new PolygonCollider2D())
    // scene.addObject(polygon)

    SceneManager.changeScene(scene.id)
  }
}