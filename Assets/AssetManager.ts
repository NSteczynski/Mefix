import Message from "../Message/Message"
import ImageAssetLoader from "./ImageAssetLoader"
import MESSAGE_ASSET_LOADER_ASET_LOADED from './MessageAsset'
import { Dictionary, Asset, AssetLoader } from "../Core/Types"

/** Responsible for managing assets. */
export default class AssetManager {
  private static _loaders: Array<AssetLoader> = []
  private static _loadedAssets: Dictionary<Asset> = {}

  /** Prevent creating new class. */
  private constructor() {}

  /** Initializes Asset Manager. */
  public static initialize(): void {
    AssetManager._loaders.push(new ImageAssetLoader())
  }

  /**
   * Register the provided loader to Asset Manager.
   * @param loader The loader to be registered.
   */
  public static registerLoader(loader: AssetLoader): void {
    AssetManager._loaders.push(loader)
  }

  /**
   * A callback when asset is loaded.
   * @param asset The asset which should load.
   */
  public static onAssetLoaded(asset: Asset): void {
    AssetManager._loadedAssets[asset.name] = asset
    Message.send(MESSAGE_ASSET_LOADER_ASET_LOADED + asset.name, this, asset)
  }

  /**
   * Load asset by name.
   * @param name The name / url of the asset.
   */
  public static loadAsset(name: string): void {
    const extension = name.split('.').pop().toLowerCase()
    const loader = AssetManager._loaders.find((loader: AssetLoader) => loader.supportedExtensions.indexOf(extension) >= 0)
    if (!loader)
      return console.warn('Unable to load asset with extension ' + extension + ' becouse there is no loader associated with it.')
    loader.loadAsset(name)
  }

  /**
   * Checks if asset by name is loaded.
   * @param name The asset name.
   */
  public static isAssetLoaded(name: string): boolean {
    return !!AssetManager._loadedAssets[name]
  }

  /**
   * Get asset by name. If not found then it is loading asset.
   * @param name The asset name.
   */
  public static getAsset(name: string): Asset {
    if (AssetManager._loadedAssets[name])
      return AssetManager._loadedAssets[name]
    AssetManager.loadAsset(name)
    return undefined
  }
}