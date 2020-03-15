/** Represents a color. */
export default class Color {
  /** The red value [0-255] */
  public r: number
  /** The green value [0-255] */
  public g: number
  /** The blue value [0-255] */
  public b: number
  /** The alpha value [0-255] */
  public a: number

  /**
   * Creates a new color.
   * @param r The red value [0-255]
   * @param g The green value [0-255]
   * @param b The blue value [0-255]
   * @param a The alpha value [0-255]
   */
  public constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  /** Returns this color as a number array */
  public toArray(): Array<number> {
    return [this.r, this.g, this.b, this.a]
  }

  /** Returns this color as a float array */
  public toFloatArray(): Array<number> {
    return [this.r / 255.0, this.g / 255.0, this.b / 255.0, this.a / 255.0]
  }

  /** Returns this color as a float32 array */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray())
  }

  /** Gets the color white. */
  public static white(): Color {
    return new Color(255, 255, 255, 255)
  }

  /** Gets the color black. */
  public static black(): Color {
    return new Color(0, 0, 0, 255)
  }

  /** Gets the color red. */
  public static red(): Color {
    return new Color(255, 0, 0, 255)
  }

  /** Gets the color green. */
  public static green(): Color {
    return new Color(0, 255, 0, 255)
  }

  /** Gets the color blue. */
  public static blue(): Color {
    return new Color(0, 0, 255, 255)
  }
}