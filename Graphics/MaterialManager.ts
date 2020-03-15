import Material from "./Material"
import { Dictionary } from "../Core/Types"

/** Responsible for managing materials references. */
export default class MaterialManager {
  private static _materials: Dictionary<MaterialReferance> = {}

  /** Prevent creating new class. */
  private constructor() {}

  /**
   * Registers the provided material with this manager.
   * @param material The material to be registered.
   */
  public static registerMaterial(material: Material): void {
    if (MaterialManager._materials[material.name] === undefined)
      MaterialManager._materials[material.name] = new MaterialReferance(material)
  }

  /**
   * Gets a material with the given name. This is case-sensitive. If no material is found, undefined is returned.
   * Also increments the reference count by 1.
   * @param name The name of the material to retrieve. Case sensitive.
   */
  public static getMaterial(name: string): Material {
    if (MaterialManager._materials[name] === undefined)
      return undefined
    MaterialManager._materials[name].referenceCount++
    return MaterialManager._materials[name].material
  }

  /**
   * Releases a reference of a material with the provided name and decrements the reference count. 
   * If the material's reference count is 0, it is automatically released. 
   * @param name The name of the material to be released.
   */
  public static releaseMaterial(name: string): void {
    if (MaterialManager._materials[name] === undefined)
      return console.warn('Cannot release a material which has not been registered.')
    MaterialManager._materials[name].referenceCount--
    if (MaterialManager._materials[name].referenceCount >= 0)
      return undefined
    MaterialManager._materials[name].material.destroy()
    MaterialManager._materials[name].material = undefined
    delete MaterialManager._materials[name]
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