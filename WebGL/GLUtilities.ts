/** Responsible for setting up a WebGL rendering context. */
export default class GLUtilities {
  private static _canvas: HTMLCanvasElement

  /** Prevent creating new class. */
  private constructor() {}

  /** The canvas element. */
  public static get canvas(): HTMLCanvasElement {
    return this._canvas
  }

  /** Responsible for creating a new canvas element. */
  public static initialize(): void {
    if (this._canvas !== undefined)
      this._canvas.removeChild(document.body)
    this._canvas = document.createElement('canvas')
    GL = this._canvas.getContext('webgl2')
    document.body.append(this._canvas)
  }
}

export let GL: WebGL2RenderingContext = undefined