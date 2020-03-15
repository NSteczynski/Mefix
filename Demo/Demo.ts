import Level from "../World/Level"
import LevelManager from "../World/LevelManager"

export default class Demo {
  private constructor() {}

  public static initialize() {
    const level = new Level('TestLevel', 'Testing level!')
    LevelManager.changeLevel(level.id)
  }
}