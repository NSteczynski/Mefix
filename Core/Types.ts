import Message from '../Message/Message'

/** A dictionary which uses string as key type. */
export type Dictionary<T> = { [key: string]: T }
/** A dictionary which uses number as key type. */
export type NumbericDictionary<T> = { [key: number]: T }

/** A message callback function. */
export type MessageCallback = (message: Message) => void

/** An interface which provides a message handler for objects which are to subscribe to messages. */
export interface MessageHandler {
  /**
   * The message handler.
   * @param message The message to be handled.
   */
  onMessage(message: Message): void
}

/** Asset Interface */
export interface Asset {
  /** The name of the asset. */
  readonly name: string
  /** The data of the asset. */
  readonly data: any
}

/** Asset Loader Interface */
export interface AssetLoader {
  /** The extension supported by asset loader. */
  readonly supportedExtensions: Array<string>
  /**
   * Loads asset by name.
   * @param name The asset name.
   */
  loadAsset(name: string): void
}

/** Built in shaders. */
export enum BuiltinShader {
  BASIC = 'basic'
}

/** Represents message priorities. */
export enum MessagePriority {
  /** Normal message priority, meaning the message is sent as soon as the queue allows. */
  NORMAL,
  /** High message priority, meaning the message is sent immediately. */
  HIGH
}

/** Represents camera projection types. */
export enum ProjectionType {
  /** Orthographic projection. Useful for 2D games. */
  ORTHOGRAPHIC,
  /** Perspective projection. Useful for 3D games. */
  PERSPECTIVE
}

/** Represents the basic level state. */
export enum LevelState {
  /** The level is not yet initialized. */
  UNINITIALIZED,
  /** The level is currently loading. */
  LOADING,
  /** The level is loaded and is currently updating. */
  UPDATING
}