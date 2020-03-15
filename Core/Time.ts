export default class Time {
  private static _deltaTime: number = 0
  private static _prevDeltaTime: number = 0

  /** The completion time in seconds since the last frame. */
  public static get deltaTime(): number {
    return this._deltaTime
  }

  public deltaTime(): void {
    Time._deltaTime = performance.now() - Time._prevDeltaTime
  }

  public prevDeltaTime(): void {
    Time._prevDeltaTime = performance.now()
  }
}