import Level from "./Level"
import { Dictionary } from "../Core/Types"

/**
 * Manages levels in the engine. Levels (for now) are registered with this manager
 * so that they may be loaded on demand. Register a level name
 * with a file path and load the level configurations dynamically.
 */
export default class LevelManager {
  private static _registeredLevels: Dictionary<Level> = {}
  private static _activeLevel: Level

  private constructor() {}

  /** Gets the active level. */
  public static get activeLevel(): Level {
      return LevelManager._activeLevel
  }

  public static registerLevel(level: Level): void {
    if (LevelManager._registeredLevels[level.id] !== undefined)
      return undefined
    LevelManager._registeredLevels[level.id] = level
  }

  /**
   * Changes the active level to the one with the provided name.
   * @param name The name of the level to change to.
   */
  public static changeLevel(id: number): void {
    if (LevelManager._activeLevel !== undefined)
      this.unloadLevel()

    if (LevelManager._registeredLevels[id] === undefined)
      return undefined

    LevelManager._activeLevel = LevelManager._registeredLevels[id]
    LevelManager._activeLevel.onActivated()
    LevelManager._activeLevel.load()
  }

  private static unloadLevel(): void {
    LevelManager._activeLevel.onDeactivated()
    LevelManager._activeLevel.unload()
    LevelManager._activeLevel = undefined
  }
}