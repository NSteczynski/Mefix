import AssetManager from '../Assets/AssetManager'
import ImageAsset from '../Assets/ImageAsset'
import Message from '../Message/Message'
import MESSAGE_ASSET_LOADER_ASET_LOADED from '../Assets/MessageAsset'
import { GL } from '../WebGL/GLUtilities'
import { MessageHandler } from '../Core/Types'

/** Represents a texture to be used in a material. These typically should not be created manually, but instead via the texture manager.*/
export default class Texture implements MessageHandler {
  private _name: string
  private _handle: WebGLTexture
  private _isLoaded: boolean = false
  private _width: number
  private _height: number

  /**
   * Creates a new Texture.
   * @param name The name of this texture.
   * @param width The width of this texture.
   * @param height The height of this texture.
   */
  public constructor(name: string, width: number = 1, height: number = 1) {
    this._name = name
    this._width = width
    this._height = height
    this._handle = GL.createTexture()

    this.bind()

    GL.texImage2D(GL.TEXTURE_2D, LEVEL, GL.RGBA, 1, 1, BORDER, GL.RGBA, GL.UNSIGNED_BYTE, TEMP_IMAGE_DATA)

    const asset = AssetManager.getAsset(this._name) as ImageAsset
    if (asset !== undefined)
      this.loadTextureFromAsset(asset)
    else
      Message.subscribe(MESSAGE_ASSET_LOADER_ASET_LOADED + this._name, this)
  }

  /** The name of this texture. */
  public get name(): string {
    return this._name
  }

  /** Indicates if this texture is loaded. */
  public get isLoaded(): boolean {
    return this._isLoaded
  }

  /** The width of this  texture. */
  public get width(): number {
    return this._width
  }

  /** The height of this texture. */
  public get height(): number {
    return this._height
  }

  /** Destroys this texture. */
  public destroy(): void {
    if (this._handle)
      GL.deleteTexture(this._handle)
  }

  /**
   * Activates the provided texture unit and binds this texture.
   * @param textureUnit The texture unit to activate on. Default: 0
   */
  public activateAndBind(textureUnit: number = 0): void {
    GL.activeTexture(GL.TEXTURE0 + textureUnit)
    this.bind()
  }

  /** Binds this texture. */
  public bind(): void {
    GL.bindTexture(GL.TEXTURE_2D, this._handle)
  }

  /** Unbinds this texture. */
  public unbind(): void {
    GL.bindTexture(GL.TEXTURE_2D, undefined)
  }

  /**
   * The message handler.
   * @param message The message to be handled.
   */
  public onMessage(message: Message): void {
    if (message.code === MESSAGE_ASSET_LOADER_ASET_LOADED + this._name)
      this.loadTextureFromAsset(message.context as ImageAsset)
  }

  private loadTextureFromAsset(asset: ImageAsset): void {
    this._width = asset.width
    this._height = asset.height

    this.bind()

    GL.texImage2D(GL.TEXTURE_2D, LEVEL, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, asset.data)

    if (this.isPowerOf2()) {
      GL.generateMipmap(GL.TEXTURE_2D)
    } else {
      // Do not generate a mip map and clamp wrapping to edge.
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
    }

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
    this._isLoaded = true
  }

  private isPowerOf2(): boolean {
    return this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this._height)
  }

  private isValuePowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0
  }
}

const LEVEL: number = 0
const BORDER: number = 0
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 0])