import { MessageHandler, MessageCallback } from "../Core/Types"

export default class MessageSubscription {
  /** The message code. */
  public code: string
  /**  The message handler. */
  public handler: MessageHandler
  /** A callback to be made for handlers which do not use the interface. */
  public callback: MessageCallback

  /**
   * Creates a new MessageSubscriptionNode.
   * @param code The message code being subscribed to.
   * @param handler The message handler.
   * @param callback The message callback.
   */
  public constructor(code: string, handler: MessageHandler, callback: MessageCallback) {
    this.code = code
    this.handler = handler
    this.callback = callback
  }
}