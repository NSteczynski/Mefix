import Dictionary from '../Core/Dictionary'
import Utilities from '../WebGL/Utilities'
import Color from '../Graphics/Color'
import Matrix from '../Maths/Matrix'
import Material from '../Graphics/Material'
import ShaderManager from './ShaderManager'

/** Represents a WebGL shader. */
export default abstract class Shader {
  private _name: string
  private _program: WebGLProgram
  private _attributes: Dictionary<number> = {}
  private _uniforms: Dictionary<WebGLUniformLocation> = {}

  /**
   * Creates a new shader.
   * @param name The name of this shader.
   */
  public constructor(name: string) {
    this._name = name
  }

  /** Destroys this shader. */
  public destroy(): void {

  }

  /** Get name of this shader. */
  public get name(): string {
    return this._name
  }

  /** Use this shader. */
  public useProgram(): void {
    if (ShaderManager.activeShader === this)
      return undefined
    Utilities.webGL.useProgram(this._program)
    ShaderManager.activeShader = this
  }

  /**
   * Sets matrix to provided uniform.
   * @param name The uniform name.
   * @param matrix The matrix to be set.
   */
  public setUniformMatrix(name: string, matrix: Matrix): void {
    if (this._uniforms[name] === undefined)
      return console.warn(`Unable to find uniform named '${name}' in shader named '${this._name}'`)
    if (matrix === undefined)
      return undefined
    const position = this.getUniformLocation(name)
    Utilities.webGL.uniformMatrix4fv(position, false, matrix.toFloat32Array())
  }

  /**
   * Sets color to privided uniform.
   * @param name The uniform name.
   * @param color The color to be set.
   */
  public setUniformColor(name: string, color: Color): void {
    if (this._uniforms[name] === undefined)
      return console.warn(`Unable to find uniform named '${name}' in shader named '${this._name}'`)
    if (color === undefined)
      return undefined

    const position = this.getUniformLocation(name)
    Utilities.webGL.uniform4fv(position, color.toFloat32Array())
  }

  /**
   * Sets value to provided uniform.
   * @param name The uniform name.
   * @param value The value to be set.
   */
  public setUniformInt(name: string, value: number): void {
    if (this._uniforms[name] === undefined)
      return console.warn(`Unable to find uniform named '${name}' in shader named '${this._name}'`)
    if (value === undefined)
      return undefined

    const position = this.getUniformLocation(name)
    Utilities.webGL.uniform1i(position, value)
  }

  /**
   * Get the location of an attribute with the provided name.
   * @param name The name of the attribute whose location to retrieve.
   */
  public getAttributeLocation(name: string): number {
    if (this._attributes[name] == undefined)
      throw new Error('Unagle to find attribute name: ' + name + ' in shader named ' + this._name)
    return this._attributes[name]
  }

  /**
   * Get the location of an uniform with the provided name.
   * @param name The name of the uniform whose location to retrieve.
   */
  public getUniformLocation(name: string): WebGLUniformLocation {
    if (this._uniforms[name] == undefined)
      throw new Error('Unagle to find uniform name: ' + name + ' in shader named ' + this._name)
    return this._uniforms[name]
  }

  /** Applies standard uniforms to this shader. */
  public abstract applyStandardUniforms(material: Material, model: Matrix, view: Matrix, projection: Matrix): void

  /**
   * Loads this shader.
   * @param vertexSource The vertex source.
   * @param fragmentSource The fragment source.
   */
  protected load(vertexSource: string, fragmentSource: string): void {
    const vertexShader = this.loadShader(vertexSource, Utilities.webGL.VERTEX_SHADER)
    const fragmentShader = this.loadShader(fragmentSource, Utilities.webGL.FRAGMENT_SHADER)

    this.createProgram(vertexShader, fragmentShader)
    this.detectAttributes()
    this.detectUniforms()
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    const shader = Utilities.webGL.createShader(shaderType)
    Utilities.webGL.shaderSource(shader, source)
    Utilities.webGL.compileShader(shader)
    const error = Utilities.webGL.getShaderInfoLog(shader).trim()
    if (error !== "")
      throw new Error('Error compiling shader ' + this._name + ': ' + error)
    return shader
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    this._program = Utilities.webGL.createProgram()

    Utilities.webGL.attachShader(this._program , vertexShader)
    Utilities.webGL.attachShader(this._program , fragmentShader)
    Utilities.webGL.linkProgram(this._program)

    const error = Utilities.webGL.getProgramInfoLog(this._program).trim()
    if (error !== '')
      throw new Error('Error linking shader ' + this._name + ': ' + error)
  }

  private detectAttributes(): void {
    const attributesCount = Utilities.webGL.getProgramParameter(this._program, Utilities.webGL.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < attributesCount; ++i) {
      const info = Utilities.webGL.getActiveAttrib(this._program, i)
      if (!info)
        break
      this._attributes[info.name] = Utilities.webGL.getAttribLocation(this._program, info.name)
    }
  }

  private detectUniforms(): void {
    const uniformCount = Utilities.webGL.getProgramParameter(this._program, Utilities.webGL.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; ++i) {
      const info = Utilities.webGL.getActiveUniform(this._program, i)
      if (!info)
        break
      this._uniforms[info.name] = Utilities.webGL.getUniformLocation(this._program, info.name)
    }
  }
}