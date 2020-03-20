import AssetLoader from './AssetLoader'
import ImageAsset from './ImageAsset'
import AssetManager from './AssetManager'

/** Represents a asset image loader. */
export default class ImageAssetLoader implements AssetLoader {
  /** The extension supported by asset loader. */
  public get supportedExtensions(): Array<string> {
    return ['png', 'gif', 'jpg', 'svg']
  }

  /**
   * Loads asset by name.
   * @param name The asset name.
   */
  public loadAsset(name: string): void {
    const image = new Image()
    image.onload = this.onImageLoaded.bind(this, name, image)
    image.src = name
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement): void {
    const asset = new ImageAsset(assetName, image)
    AssetManager.onAssetLoaded(asset)
  }
}