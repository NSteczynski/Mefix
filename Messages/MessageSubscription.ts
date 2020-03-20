import MessageCallback from './MessageCallback'

/** Represents a message subscription. */
export default class MessageSubscription {
  /** The message code. */
  public message: string
  /** A callback to be made for handlers which do not use the interface. */
  public callback: MessageCallback

  /**
   * Creates a new MessageSubscription.
   * @param message The message code being subscribed to.
   * @param handler The message handler.
   * @param callback The message callback.
   */
  public constructor(message: string, callback: MessageCallback) {
    this.message = message
    this.callback = callback
  }
}