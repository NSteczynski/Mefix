import Component from "./Component"

export default class Behaviour extends Component {
  /** Returns if component is enabled or disabled. */
  private isEnabled: boolean

  public constructor(name: string, isEnabled: boolean = true) {
    super(name)
    this.isEnabled = isEnabled
  }
}