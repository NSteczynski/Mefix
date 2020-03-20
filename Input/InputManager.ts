import Dictionary from '../Core/Dictionary'
import Vector2 from '../Maths/Vector2'

export default abstract class InputManager {
  private static _keys: Dictionary<boolean>
  private static _buttons: Dictionary<boolean>
  private static _mousePosition: Vector2

  public static initialize(): void {
    this._keys = {}
    this._buttons = {}

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  /** The mouse position on screen. */
  public static get mousePosition(): Vector2 {
    return this._mousePosition
  }

  /**
   * Returns if provided key is pressed down.
   * @param key The key to check.
   */
  public static isKeyDown(key: number | string): boolean {
    return this._keys[key]
  }

  /**
   * Returns if provided button is pressed down.
   * @param button The button to check.
   */
  public static isMouseButtonDown(button: number): boolean {
    return this._buttons[button]
  }

  private static onKeyDown(event: KeyboardEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this._keys[event.key] = true
    this._keys[event.key.toUpperCase()] = true
    this._keys[event.keyCode] = true
  }

  private static onKeyUp(event: KeyboardEvent): void {
    event.preventDefault()
    event.stopPropagation()
    delete this._keys[event.key]
    delete this._keys[event.key.toUpperCase()]
    delete this._keys[event.keyCode]
  }

  private static onMouseMove(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this._mousePosition = new Vector2(event.clientX, event.clientY)
  }

  private static onMouseDown(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this._buttons[event.button] = true
  }

  private static onMouseUp(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    delete this._buttons[event.button]
  }
}