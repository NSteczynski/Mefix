/** Represents a asset loader. */
export default abstract class AssetLoader {
  /** The extension supported by asset loader. */
  public readonly supportedExtensions: Array<string>

  /**
   * Loads asset by name.
   * @param name The asset name.
   */
  public abstract loadAsset(name: string): void
}