import Texture from "./Texture"
import { Dictionary } from '../Core/Types'

/** Responsible for managing textures references. */
export default class TextureManager {
  private static _textures: Dictionary<TextureReference> = {}

  /** Prevent creating new class. */
  private constructor() {}

  /**
   * Gets a Texture with the given name. This is case-sensitive. If no Texture is found, undefined is returned.
   * Also increments the reference count by 1.
   * @param name The name of the texture to get. If one is not found, a new one is created, using this as the texture path.
   */
  public static getTexture(name: string): Texture {
    if (TextureManager._textures[name] === undefined) {
      const texture = new Texture(name)
      TextureManager._textures[name] = new TextureReference(texture)
    } else {
      TextureManager._textures[name].referenceCount++
    }

    return TextureManager._textures[name].texture
  }

  /**
   * Releases a reference of a Texture with the provided name and decrements the reference count. 
   * If the Texture's reference count is 0, it is automatically released. 
   * @param name The name of the Texture to be released.
   */
  public static releaseTexture(name: string): void {
    if (TextureManager._textures[name] === undefined)
      return console.warn('A texture named ' + name + 'does not exist and cannot be released.')
    TextureManager._textures[name].referenceCount--
    if (TextureManager._textures[name].referenceCount >= 1)
      return undefined
    TextureManager._textures[name].texture.destroy()
    TextureManager._textures[name] = undefined
    delete TextureManager._textures[name]
  }
}

/** Holds reference information for a given Texture. */
class TextureReference {
  /** The referenced Texture. */
  public texture: Texture
  /** The number of times the Texture is referenced. Default is 1 because this is only created when a Texture is needed. */
  public referenceCount: number = 1

  /**
   * Creates a new TextureReference.
   * @param texture The Texture to be referenced.
   */
  public constructor(texture: Texture) {
    this.texture = texture
  }
}