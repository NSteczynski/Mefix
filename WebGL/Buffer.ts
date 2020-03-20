import AttributeInfo from './AttributeInfo'
import Utilities from './Utilities'

/** Represents a WebGL Buffer.  */
export default class Buffer {
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
   * @param dataType The data type of buffer. Default: FLOAT
   * @param targetBufferType The buffer target type. Can be either ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER. Default: ARRAY_BUFFER
   * @param mode The drawing mode of buffer. Can be either TRIANGLES or LINES. Default: TRIANGLES
   */
  public constructor(dataType: number = Utilities.webGL.FLOAT, targetBufferType: number = Utilities.webGL.ARRAY_BUFFER, mode: number = Utilities.webGL.TRIANGLES) {
    this._elementSize = 0
    this._dataType = dataType
    this._targetBufferType = targetBufferType
    this._mode = mode

    this._typeSize = this.determineByteSize(this._dataType)
    this._buffer = Utilities.webGL.createBuffer()
  }

  /** Destroys the buffer. */
  public destroy(): void {
    Utilities.webGL.deleteBuffer(this._buffer)
  }

  /**
   * Binds this buffer.
   * @param normalized Indicates if the data should be normalized. Default: false
   */
  public bind(normalized: boolean = false): void {
    Utilities.webGL.bindBuffer(this._targetBufferType, this._buffer)
    if (!this._hasAttributeLocation)
      return undefined
    this._attributes.forEach(attribute => {
      Utilities.webGL.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, this._stride, attribute.offset * this._typeSize)
      Utilities.webGL.enableVertexAttribArray(attribute.location)
    })
  }

  /** Unbinds this buffer. */
  public unbind(): void {
    this._attributes.forEach(attribute => Utilities.webGL.disableVertexAttribArray(attribute.location))
    Utilities.webGL.bindBuffer(this._targetBufferType, undefined)
  }

  /**
   * Adds an attribute with the provided information to buffer.
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
   * Replaces the current data in buffer with the provided data.
   * @param data The data to be loaded in buffer.
   */
  public setData(data: Array<number>): void {
    this.clearData()
    this.pushBackData(data)
  }

  /**
   * Adds data to buffer.
   * @param data The data to be loaded in buffer.
   */
  public pushBackData(data: Array<number>): void {
    data.forEach(d => this._data.push(d))
  }

  /** Clears out all data in buffer. */
  public clearData(): void {
    this._data.length = 0
  }

  /** Uploads buffer's data to the GPU. */
  public uplaod(): void {
    Utilities.webGL.bindBuffer(this._targetBufferType, this._buffer)
    const bufferData = this.bufferDataFromType(this._dataType)
    Utilities.webGL.bufferData(this._targetBufferType, bufferData, Utilities.webGL.STATIC_DRAW)
  }

  /** Draws buffer. */
  public draw(): void {
    if (this._targetBufferType === Utilities.webGL.ARRAY_BUFFER)
      Utilities.webGL.drawArrays(this._mode, 0, this._data.length / this._elementSize)
    else if (this._targetBufferType === Utilities.webGL.ELEMENT_ARRAY_BUFFER)
      Utilities.webGL.drawElements(this._mode, this._data.length, this._dataType, 0)
  }

  private bufferDataFromType(dataType: number): ArrayBuffer {
    switch(dataType) {
      case Utilities.webGL.FLOAT:
        return new Float32Array(this._data)
      case Utilities.webGL.INT:
        return new Int32Array(this._data)
      case Utilities.webGL.UNSIGNED_INT:
        return new Uint32Array(this._data)
      case Utilities.webGL.SHORT:
        return new Int16Array(this._data) 
      case Utilities.webGL.UNSIGNED_SHORT:
        return new Uint16Array(this._data)
      case Utilities.webGL.BYTE:
        return new Int8Array(this._data)
      case Utilities.webGL.UNSIGNED_BYTE:
        return new Uint8Array(this._data)
      default:
        throw new Error('Unrecognized data type: ' + dataType.toString())
    }
  }

  private determineByteSize(dataType: number): number {
    switch(dataType) {
      case Utilities.webGL.FLOAT:
      case Utilities.webGL.INT:
      case Utilities.webGL.UNSIGNED_INT:
        return 4
      case Utilities.webGL.SHORT:
      case Utilities.webGL.UNSIGNED_SHORT:
        return 2
      case Utilities.webGL.BYTE:
      case Utilities.webGL.UNSIGNED_BYTE:
        return 1
      default:
        throw new Error('Unrecognized data type: ' + dataType.toString())
    }
  }
}