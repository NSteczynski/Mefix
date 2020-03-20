import Dictionary from '../Core/Dictionary'
import Material from './Material'

/** Responsible for managing materials. */
export default abstract class MaterialManager {
  private static _materials: Dictionary<MaterialReferance> = {}

  /**
   * Registers the provided material with this manager.
   * @param material The material to be registered.
   */
  public static registerMaterial(material: Material): void {
    if (this._materials[material.name] === undefined)
      this._materials[material.name] = new MaterialReferance(material)
  }

  /**
   * Gets a material with the given name. This is case-sensitive. If no material is found, undefined is returned.
   * Also increments the reference count by 1.
   * @param name The name of the material to retrieve. Case sensitive.
   */
  public static getMaterial(name: string): Material {
    if (this._materials[name] === undefined)
      return undefined
    this._materials[name].referenceCount++
    return this._materials[name].material
  }

  /**
   * Releases a reference of a material with the provided name and decrements the reference count. 
   * If the material's reference count is 0, it is automatically released. 
   * @param name The name of the material to be released.
   */
  public static releaseMaterial(name: string): void {
    if (this._materials[name] === undefined)
      return console.warn('Cannot release a material which has not been registered.')
    this._materials[name].referenceCount--
    if (this._materials[name].referenceCount >= 0)
      return undefined
    this._materials[name].material.destroy()
    this._materials[name].material = undefined
    delete this._materials[name]
  }
}

/** Holds reference information for a given material. */
class MaterialReferance {
  /** The referenced material. */
  public material: Material
  /** The number of times the material is referenced. Default is 1 because this is only created when a material is needed. */
  public referenceCount: number = 1

  /**
   * Creates a new MaterialReferenceNode.
   * @param material The material to be referenced.
   */
  public constructor(material: Material) {
    this.material = material
  }
}