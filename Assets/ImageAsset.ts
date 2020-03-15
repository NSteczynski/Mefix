import { Asset } from "../Core/Types"

/** Image Asset. */
export default class ImageAsset implements Asset {
  /** The name of asset. */
  public readonly name: string
  /** The data of asset. */
  public readonly data: HTMLImageElement

  /**
   * Creates a new image asset.
   * @param name The name of asset.
   * @param data The data of asset.
   */
  public constructor(name: string, data: HTMLImageElement) {
    this.name = name
    this.data = data
  }

  /** The width of image asset. */
  public get width(): number {
    return this.data.width
  }

  /** The height of image asset. */
  public get height(): number {
    return this.data.height
  }
}