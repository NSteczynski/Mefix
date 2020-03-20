import Message from './Message'
import MessageCallback from './MessageCallback'

/** Represents a queued message with a callback. */
export default class MessageQueue {
  /** The message code. */
  public message: Message
  /** A callback to be made for handlers which do not use the interface. */
  public callback: MessageCallback

  /**
   * Creates a new MessageQueue.
   * @param message The message code being subscribed to.
   * @param callback The message callback.
   */
  public constructor(message: Message, callback: MessageCallback) {
    this.message = message
    this.callback = callback
  }
}