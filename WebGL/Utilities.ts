/** Responsible for creating canvas element and WebGL rendering context. */
export default abstract class Utilities {
  private static _canvas: HTMLCanvasElement
  private static _webGL: WebGL2RenderingContext

  /** The canvas element. */
  public static get canvas(): HTMLCanvasElement {
    return this._canvas
  }

  /** The WebGL context. */
  public static get webGL(): WebGL2RenderingContext {
    return this._webGL
  }

  /** Initializes canvas and WebGL. */
  public static initialize(): void {
    this._canvas = document.createElement('canvas')
    this._webGL = this._canvas.getContext('webgl2')
    document.body.append(this._canvas)
  }
}