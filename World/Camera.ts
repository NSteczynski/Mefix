import GameObject from './GameObject'
import CameraComponent from '../Components/Builtin/CameraComponent'

export default class Camera extends GameObject {
  /**
   * Creates a new camera object.
   * @param name The name of the camera object.
   */
  public constructor(name: string) {
    super(name)
    this.addComponent(new CameraComponent())
    this.transform.position.z = -10
  }
}