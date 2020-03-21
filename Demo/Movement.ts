import Component from '../Components/Component'
import InputManager from '../Input/InputManager'
import Time from '../Core/Time'

export default class Movement extends Component {
  public update(): void {
    if (InputManager.isKeyDown('W'))
      this.owner.transform.position.y += 2 * Time.deltaTime
    if (InputManager.isKeyDown('S'))
      this.owner.transform.position.y -= 2 * Time.deltaTime
    if (InputManager.isKeyDown('D'))
      this.owner.transform.position.x += 2 * Time.deltaTime
    if (InputManager.isKeyDown('A'))
      this.owner.transform.position.x -= 2 * Time.deltaTime
    // this.owner.transform.scale.x += Time.deltaTime
    // this.owner.transform.scale.y += Time.deltaTime
    // this.owner.transform.scale.z += Time.deltaTime
    // this.owner.transform.rotation.x += Time.deltaTime
    // this.owner.transform.rotation.y += Time.deltaTime
    // this.owner.transform.rotation.z += Time.deltaTime
  }
}