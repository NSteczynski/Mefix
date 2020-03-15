import Message from "./Message"
import { MessageHandler, MessageCallback } from "../Core/Types"

/** Represents a queued message with a handler pointer and/or callback. */
export default class MessageQueue {
  /** The message code. */
  public message: Message
  /**  The message handler. */
  public handler: MessageHandler
  /** A callback to be made for handlers which do not use the interface. */
  public callback: MessageCallback

  /**
   * Creates a new MessageSubscriptionNode.
   * @param message The message code being subscribed to.
   * @param handler The message handler.
   * @param callback The message callback.
   */
  public constructor(message: Message, handler: MessageHandler, callback: MessageCallback) {
    this.message = message
    this.handler = handler
    this.callback = callback
  }
}