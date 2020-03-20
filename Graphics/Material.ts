import Color from './Color'
import Texture from './Texture'
import TextureManager from './TextureManager'
import Matrix from '../Maths/Matrix'
import Shader from '../Shaders/Shader'

/** Represents a material surface information which is used during rendering. */
export default class Material {
  /** The color value of the tint to apply to the material. */
  public tint: Color

  private _name: string
  private _diffuseTextureName: string

  private _shader: Shader
  private _diffuseTexture: Texture

  /**
   * Creates a new material.
   * @param name The name of material.
   * @param shader The shader used by material.
   * @param diffuseTextureName The name of the diffuse texture.
   * @param tint The color value of the tint to apply to the material.
   */
  public constructor(name: string, shader: Shader, diffuseTextureName: string, tint: Color) {
    this._name = name
    this._shader = shader
    this._diffuseTextureName = diffuseTextureName
    this.tint = tint

    if (this._diffuseTextureName !== undefined)
      this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName)
  }

  /**
   * Applies material.
   * @param model The model matrix to be applied.
   * @param view The view matrix to be applied.
   * @param projection The projection matrix to be applied.
   */
  public apply(model: Matrix, view: Matrix, projection: Matrix): void {
    this._shader.applyStandardUniforms(this, model, view, projection)
  }

  /** The name of material. */
  public get name(): string {
    return this._name
  }

  /** The diffuse texture. */
  public get diffuseTexture(): Texture {
    return this._diffuseTexture
  }

  /** The name of the diffuse texture. */
  public get diffuseTextureName(): string {
    return this._diffuseTextureName
  }

  /** Sets the diffuse texture name, which triggers a texture load if need be. */
  public set diffuseTextureName(value: string) {
    if (this._diffuseTexture !== undefined)
      TextureManager.releaseTexture(this._diffuseTextureName)
    this._diffuseTextureName = value
    if (this._diffuseTextureName !== undefined)
      this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName)
  }

  /** Destroys this material. */
  public destroy(): void {
    TextureManager.releaseTexture(this._diffuseTextureName)
    this._diffuseTexture = undefined
  }
}