import MessagePriority from './MessagePriority'
import MessageSender from './MessageSender'
import MessageCallback from './MessageCallback'

/** Represents a message which can be sent and processed across the system. */
export default class Message {
  /** The code for message, which is subscribed to and listened for. */
  public code: string
  /** Free-form context data to be included with message. */
  public context: any
  /** The class instance which sent message. */
  public sender: any
  /** The priority of message. */
  public priority: MessagePriority

  /**
   * Creates a new message.
   * @param code The code for message, which is subscribed to and listened for.
   * @param sender The class instance which sent message.
   * @param context Free-form context data to be included with message.
   * @param priority The priority of message.
   */
  public constructor(code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL) {
    this.code = code
    this.sender = sender
    this.context = context
    this.priority = priority
  }

  /**
   * Sends a normal-priority message with the provided parameters.
   * @param code The code for message, which is subscribed to and listened for.
   * @param sender The class instance which sent message.
   * @param context Free-form context data to be included with message.
   */
  public static send(code: string, sender: any, context?: any): void {
    MessageSender.post(new Message(code, sender, context, MessagePriority.NORMAL))
  }

  /**
   * Sends a high-priority message with the provided parameters.
   * @param code The code for message, which is subscribed to and listened for.
   * @param sender The class instance which sent message.
   * @param context Free-form context data to be included with message.
   */
  public static sendPriority(code: string, sender: any, context?: any): void {
    MessageSender.post(new Message(code, sender, context, MessagePriority.HIGH))
  }

  /**
   * Subscribes the provided callback to listen for the message code provided.
   * @param code The code to listen for.
   * @param callback The message callback to be invoked when a message containing the provided code is sent.
   */
  public static subscribe(code: string, callback: MessageCallback): void {
    MessageSender.addSubscription(code, callback)
  }

  /**
   * Unsubscribes the provided callback from listening for the message code provided.
   * @param code The code to no longer listen for.
   * @param callback The message callback to unsubscribe.
   */
  public static unsubscribe(code: string, callback: MessageCallback): void {
    MessageSender.removeSubscription(code, callback)
  }
}