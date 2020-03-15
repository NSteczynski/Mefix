import Shader from "./Shader"
import BasicShader from './BasicShader'
import { Dictionary } from "../Core/Types"

/** Responsible for managing shaders references. */
export default class ShaderManager {
  private static _shaders: Dictionary<ShaderReference> = {}
  private static _activeShader: Shader

  private constructor() {}

  /** Initializes this shader manager. */
  public static initialize(): void {
    ShaderManager.register(new BasicShader())
  }

  /** Active shader */
  public static get activeShader(): Shader {
    return ShaderManager._activeShader
  }

  /** Active shader */
  public static set activeShader(value: Shader) {
    if (ShaderManager._activeShader !== value)
      ShaderManager._activeShader = value
  }

  /**
   * Registers the provided shader.
   * @param shader The shader to be registered.
   */
  public static register(shader: Shader): void {
    if (ShaderManager._shaders[shader.name] !== undefined)
      return console.warn(`A shader named ${shader.name} already exists and will not be re-registered.`)
    ShaderManager._shaders[shader.name] = new ShaderReference(shader)
  }

  /**
   * Gets a Shader with the given name. This is case-sensitive. If no Shader is found, undefined is returned.
   * Also increments the reference count by 1.
   * @param name The name of the shader to get. If one is not found, a new one is created, using this as the Shader path.
   */
  public static getShader(name: string): Shader {
    if (ShaderManager._shaders[name] === undefined)
      return undefined
    ShaderManager._shaders[name].referenceCount++
    return ShaderManager._shaders[name].shader
  }

  /**
   * Releases a reference of a Shader with the provided name and decrements the reference count. 
   * If the Shader's reference count is 0, it is automatically released. 
   * @param shaderName The name of the Shader to be released.
   */
  public static releaseShader(name: string): void {
    if (ShaderManager._shaders[name] === undefined)
      return console.warn(`A shader named ${name} does not exist and therefore cannot be released.`)
    ShaderManager._shaders[name].referenceCount--
    if (ShaderManager._shaders[name].referenceCount >= 0)
      return undefined
    ShaderManager._shaders[name].shader.destroy()
    ShaderManager._shaders[name].shader = undefined
    delete ShaderManager._shaders[name]
  }
}

class ShaderReference {
  /** The referenced Shader. */
  public shader: Shader
  /** The number of times the Shader is referenced. Default is 1 because this is only created when a Shader is needed. */
  public referenceCount: number = 1

  /**
   * Creates a new ShaderReference.
   * @param shader The Shader to be referenced.
   */
  public constructor(shader: Shader) {
    this.shader = shader
  }
}