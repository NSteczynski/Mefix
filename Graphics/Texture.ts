import AssetManager from '../Assets/AssetManager'
import ImageAsset from '../Assets/ImageAsset'
import Message from '../Messages/Message'
import Utilities from '../WebGL/Utilities'
import MESSAGE_ASSET_LOADER_ASET_LOADED from '../Assets/AssetMessage'

const LEVEL: number = 0
const BORDER: number = 0
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 0])

/** Represents a texture to be used in a material. These typically should not be created manually, but instead via the texture manager.*/
export default class Texture {
  private _name: string
  private _handle: WebGLTexture
  private _isLoaded: boolean = false
  private _width: number
  private _height: number

  /**
   * Creates a new Texture.
   * @param name The name of texture.
   * @param width The width of texture.
   * @param height The height of texture.
   */
  public constructor(name: string, width: number = 1, height: number = 1) {
    this._name = name
    this._width = width
    this._height = height
    this._handle = Utilities.webGL.createTexture()

    this.bind()

    Utilities.webGL.texImage2D(Utilities.webGL.TEXTURE_2D, LEVEL, Utilities.webGL.RGBA, 1, 1, BORDER, Utilities.webGL.RGBA, Utilities.webGL.UNSIGNED_BYTE, TEMP_IMAGE_DATA)

    const asset = AssetManager.getAsset(this._name) as ImageAsset
    if (asset !== undefined)
      this.loadTextureFromAsset(asset)
    else
      Message.subscribe(MESSAGE_ASSET_LOADER_ASET_LOADED + this._name, this.onMessage.bind(this))
  }

  /** The name of texture. */
  public get name(): string {
    return this._name
  }

  /** Indicates if texture is loaded. */
  public get isLoaded(): boolean {
    return this._isLoaded
  }

  /** The width of texture. */
  public get width(): number {
    return this._width
  }

  /** The height of texture. */
  public get height(): number {
    return this._height
  }

  /** Destroys texture. */
  public destroy(): void {
    if (this._handle)
      Utilities.webGL.deleteTexture(this._handle)
  }

  /**
   * Activates the provided texture unit and binds texture.
   * @param textureUnit The texture unit to activate on. Default: 0
   */
  public activateAndBind(textureUnit: number = 0): void {
    Utilities.webGL.activeTexture(Utilities.webGL.TEXTURE0 + textureUnit)
    this.bind()
  }

  /** Binds texture. */
  public bind(): void {
    Utilities.webGL.bindTexture(Utilities.webGL.TEXTURE_2D, this._handle)
  }

  /** Unbinds texture. */
  public unbind(): void {
    Utilities.webGL.bindTexture(Utilities.webGL.TEXTURE_2D, undefined)
  }

  private onMessage(message: Message): void {
    if (message.code === MESSAGE_ASSET_LOADER_ASET_LOADED + this._name)
      this.loadTextureFromAsset(message.context as ImageAsset)
  }

  private loadTextureFromAsset(asset: ImageAsset): void {
    this._width = asset.width
    this._height = asset.height

    this.bind()

    Utilities.webGL.texImage2D(Utilities.webGL.TEXTURE_2D, LEVEL, Utilities.webGL.RGBA, Utilities.webGL.RGBA, Utilities.webGL.UNSIGNED_BYTE, asset.data)

    if (this.isPowerOf2()) {
      Utilities.webGL.generateMipmap(Utilities.webGL.TEXTURE_2D)
    } else {
      // Do not generate a mip map and clamp wrapping to edge.
      Utilities.webGL.texParameteri(Utilities.webGL.TEXTURE_2D, Utilities.webGL.TEXTURE_WRAP_S, Utilities.webGL.CLAMP_TO_EDGE)
      Utilities.webGL.texParameteri(Utilities.webGL.TEXTURE_2D, Utilities.webGL.TEXTURE_WRAP_T, Utilities.webGL.CLAMP_TO_EDGE)
    }

    Utilities.webGL.texParameteri(Utilities.webGL.TEXTURE_2D, Utilities.webGL.TEXTURE_MIN_FILTER, Utilities.webGL.NEAREST)
    Utilities.webGL.texParameteri(Utilities.webGL.TEXTURE_2D, Utilities.webGL.TEXTURE_MAG_FILTER, Utilities.webGL.NEAREST)
    this._isLoaded = true
  }

  private isPowerOf2(): boolean {
    return this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this._height)
  }

  private isValuePowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0
  }
}