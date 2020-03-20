/** Represents the information needed for Buffer attribute. */
export default class AttributeInfo {
  /** The location of attribute. */
  public location: number
  /** The number of elements in attribute. */
  public size: number
  /** The number of elements from the beginning of the buffer. */
  public offset: number = 0
}