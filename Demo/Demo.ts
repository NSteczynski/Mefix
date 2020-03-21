import Scene from '../World/Scene'
import SceneManager from '../World/SceneManager'
import GameObject from '../World/GameObject'
import BoxCollider2D from '../Colliders/2D/BoxCollider2D'
import CircleCollider2D from '../Colliders/2D/CircleCollider2D'
import PolygonCollider2D from '../Colliders/2D/PolygonCollider2D'
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
    player.addComponent(new CircleCollider2D(.5))
    // player.addComponent(new PolygonCollider2D())
    scene.addObject(player)

    // const square = new GameObject('square')
    // square.transform.position.x = -3
    // square.addComponent(new BoxCollider2D())
    // scene.addObject(square)

    // const circle = new GameObject('circle')
    // circle.transform.position.y = 3
    // circle.addComponent(new CircleCollider2D())
    // scene.addObject(circle)

    // const polygon = new GameObject('polygon')
    // polygon.transform.position.x = 3
    // polygon.addComponent(new PolygonCollider2D())
    // scene.addObject(polygon)

    // 83, 61
    for (let i = 0; i < 20000; i++) {
      for (let k = 0; k < 1; k++) {
        const element = new GameObject(`element-${i}-${k}`)
        // element.addComponent(new BoxCollider2D(new Vector2(.32, .32)))
        element.transform.position = new Vector3(10 - i, 9 - k)
        scene.addObject(element)
      }
    }
    // console.log('rdy')

    SceneManager.changeScene(scene.id)
  }
}