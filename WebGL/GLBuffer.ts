import AttributeInfo from "./AttributeInfo"
import { GL } from './GLUtilities'

/** Represents a WebGL Buffer. */
export default class GLBuffer {
  private _hasAttributeLocation: boolean = false
  private _elementSize: number
  private _stride: number
  private _buffer: WebGLBuffer

  private _targetBufferType: number
  private _dataType: number
  private _mode: number
  private _typeSize: number

  private _data: Array<number> = []
  private _attributes: Array<AttributeInfo> = []

  /**
   * Creates a new WebgGL buffer.
   * @param dataType The data type of this buffer. Default: GL.FLOAT
   * @param targetBufferType The buffer target type. Can be either GL.ARRAY_BUFFER or GL.ELEMENT_ARRAY_BUFFER. Default: GL.ARRAY_BUFFER
   * @param mode The drawing mode of this buffer. Can be either GL.TRIANGLES or GL.LINES. Default: GL.TRIANGLES
   */
  public constructor(dataType: number = GL.FLOAT, targetBufferType: number = GL.ARRAY_BUFFER, mode: number = GL.TRIANGLES) {
    this._elementSize = 0
    this._dataType = dataType
    this._targetBufferType = targetBufferType
    this._mode = mode

    this._typeSize = this.determineByteSize(this._dataType)
    this._buffer = GL.createBuffer()
  }

  /** Destroys this buffer. */
  public destroy(): void {
    GL.deleteBuffer(this._buffer)
  }

  /**
   * Binds this buffer.
   * @param normalized Indicates if the data should be normalized. Default: false
   */
  public bind(normalized: boolean = false): void {
    GL.bindBuffer(this._targetBufferType, this._buffer)
    if (!this._hasAttributeLocation)
      return undefined
    this._attributes.forEach(attribute => {
      GL.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, this._stride, attribute.offset * this._typeSize)
      GL.enableVertexAttribArray(attribute.location)
    })
  }

  /** Unbinds this buffer. */
  public unbind(): void {
    this._attributes.forEach(attribute => GL.disableVertexAttribArray(attribute.location))
    GL.bindBuffer(this._targetBufferType, undefined)
  }

  /**
   * Adds an attribute with the provided information to this buffer.
   * @param info The information to be added.
   */
  public addAttributeLocation(info: AttributeInfo): void {
    this._hasAttributeLocation = true
    info.offset = this._elementSize
    this._attributes.push(info)
    this._elementSize += info.size
    this._stride = this._elementSize * this._typeSize
  }

  /**
   * Replaces the current data in this buffer with the provided data.
   * @param data The data to be loaded in this buffer.
   */
  public setData(data: Array<number>): void {
    this.clearData()
    this.pushBackData(data)
  }

  /**
   * Adds data to this buffer.
   * @param data The data to be loaded in this buffer.
   */
  public pushBackData(data: Array<number>): void {
    data.forEach(d => this._data.push(d))
  }

  /** Clears out all data in this buffer. */
  public clearData(): void {
    this._data.length = 0
  }

  /** Uploads this buffer's data to the GPU. */
  public uplaod(): void {
    GL.bindBuffer(this._targetBufferType, this._buffer)
    const bufferData = this.bufferDataFromType(this._dataType)
    GL.bufferData(this._targetBufferType, bufferData, GL.STATIC_DRAW)
  }

  /** Draws this buffer. */
  public draw(): void {
    if (this._targetBufferType === GL.ARRAY_BUFFER)
      GL.drawArrays(this._mode, 0, this._data.length / this._elementSize)
    else if (this._targetBufferType === GL.ELEMENT_ARRAY_BUFFER)
      GL.drawElements(this._mode, this._data.length, this._dataType, 0)
  }

  private bufferDataFromType(dataType: number): ArrayBuffer {
    switch(dataType) {
      case GL.FLOAT:
        return new Float32Array(this._data)
      case GL.INT:
        return new Int32Array(this._data)
      case GL.UNSIGNED_INT:
        return new Uint32Array(this._data)
      case GL.SHORT:
        return new Int16Array(this._data) 
      case GL.UNSIGNED_SHORT:
        return new Uint16Array(this._data)
      case GL.BYTE:
        return new Int8Array(this._data)
      case GL.UNSIGNED_BYTE:
        return new Uint8Array(this._data)
      default:
        throw new Error('Unrecognized data type: ' + dataType.toString())
    }
  }

  private determineByteSize(dataType: number): number {
    switch(dataType) {
      case GL.FLOAT:
      case GL.INT:
      case GL.UNSIGNED_INT:
        return 4
      case GL.SHORT:
      case GL.UNSIGNED_SHORT:
        return 2
      case GL.BYTE:
      case GL.UNSIGNED_BYTE:
        return 1
      default:
        throw new Error('Unrecognized data type: ' + dataType.toString())
    }
  }
}