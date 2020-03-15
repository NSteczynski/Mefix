import Vector2 from '../Math/Vector2'

/** Manages all input from devices such as the mouse and keyboard. */
export default class InputManager {
  private static _keys: Array<boolean> = []
  private static _mouseButtons: Array<boolean> = []
  private static _mouseX: number
  private static _mouseY: number

  /** Prevent creating new class. */
  private constructor() {}

  /** Initializes the input manager. */
  public static initialize(): void {
    for (let i = 0; i < 255; ++i) {
      InputManager._keys[i] = false
    }

    for (let i = 0; i < 3; ++i) {
      InputManager._mouseButtons[i] = false
    }

    window.addEventListener('keydown', InputManager.onKeyDown)
    window.addEventListener('keyup', InputManager.onKeyUp)
    window.addEventListener('mousemove', InputManager.onMouseMove)
    window.addEventListener('mousedown', InputManager.onMouseDown)
    window.addEventListener('mouseup', InputManager.onMouseUp)
  }

  /**
   * Indicates if the provided key is currently down.
   * @param key The key to check in unicode.
   */
  public static isKeyDown(key: number): boolean {
    return InputManager._keys[key]
  }

  /** Gets the current mouse position. */
  public static getMousePosition(): Vector2 {
    return new Vector2(InputManager._mouseX, InputManager._mouseY)
  }

  /**
   * Indicates if the provided mouse button is currently down.
   * @param button The mouse button to check.
   */
  public static isMouseButtonDown(button: number): boolean {
    return InputManager._mouseButtons[button]
  }

  private static onKeyDown(event: KeyboardEvent): boolean {
    event.preventDefault()
    event.stopPropagation()
    InputManager._keys[event.keyCode] = true
    return false
  }

  private static onKeyUp(event: KeyboardEvent): boolean {
    event.preventDefault()
    event.stopPropagation()
    InputManager._keys[event.keyCode] = false
    return false
  }

  private static onMouseMove(event: MouseEvent): void {
    InputManager._mouseX = event.clientX
    InputManager._mouseY = event.clientY
  }

  private static onMouseDown(event: MouseEvent): void {
    InputManager._mouseButtons[event.button] = true
  }

  private static onMouseUp(event: MouseEvent): void {
    InputManager._mouseButtons[event.button] = false
  }
}