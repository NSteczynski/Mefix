export default class Time {
  private static _deltaTime: number = 0
  private static _prevDeltaTime: number = 0

  /** The completion time in seconds since the last frame. */
  public static get deltaTime(): number {
    return this._deltaTime
  }

  public checkDelta(): void {
    Time._deltaTime = (performance.now() - Time._prevDeltaTime) / 1000
  }

  public checkPrevDelta(): void {
    Time._prevDeltaTime = performance.now()
  }
}