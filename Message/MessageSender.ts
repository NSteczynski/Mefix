import Message from "./Message"
import MessageQueueNode from "./MessageQueue"
import MessageSubscriptionNode from "./MessageSubscription"
import { Dictionary, MessagePriority, MessageHandler, MessageCallback } from "../Core/Types"

/** The message manager responsible for sending messages across the system. */
export default class MessageSender {
  private static _subscriptions: Dictionary<Array<MessageSubscriptionNode>> = {}
  private static _normalQueueMessagePerUpdate: number = 10
  private static _normalMessageQueue: Array<MessageQueueNode> = []

  /** Prevent creating new class. */
  private constructor() {}

  /**
   * Adds a subscription to the provided code using the provided handler.
   * @param code The code to listen for.
   * @param handler The handler to be subscribed.
   * @param callback The message callback.
   */
  public static addSubscription(code: string, handler: MessageHandler, callback: MessageCallback): void {
    if (MessageSender._subscriptions[code] === undefined)
      MessageSender._subscriptions[code] = []
    if (handler === undefined && callback === undefined)
      return console.warn("Cannot add subscription where both the handler and callback are undefined.")

    const type = handler !== undefined ? handler : callback
    const stringType = handler !== undefined ? 'handler' : 'callback'
    const matches = MessageSender._subscriptions[code].filter(x => x[stringType] === type)

    if (matches.length !== 0)
      return console.warn("Attempting to add a duplicate handler/callback to code: " + code + ". Subscription not added.")
    const node = new MessageSubscriptionNode(code, handler, callback)
    MessageSender._subscriptions[code].push(node)
  }

  /**
   * Removes a subscription to the provided code using the provided handler.
   * @param code The code to no longer listen for.
   * @param handler The handler to be unsubscribed.
   * @param callback The message callback.
   */
  public static removeSubscription(code: string, handler: MessageHandler, callback: MessageCallback): void {
    if (MessageSender._subscriptions[code] === undefined)
      return console.warn("Cannot unsubscribe handler from code: " + code + " Because that code is not subscribed to.")
    if (handler === undefined && callback === undefined)
      return console.warn("Cannot add subscription where both the handler and callback are undefined.")
    const type = handler !== undefined ? handler : callback
    const stringType = handler !== undefined ? 'handler' : 'callback'
    const matches = MessageSender._subscriptions[code].filter(x => x[stringType] === type)

    matches.forEach(match => {
      const nodeIndex = MessageSender._subscriptions[code].indexOf(match)
      if (nodeIndex >= 0)
        MessageSender._subscriptions[code].splice(nodeIndex, 1)
    })
  }

  /**
   * Posts the provided message to the message system.
   * @param message The message to be sent.
   */
  public static post(message: Message): void {
    const nodes = MessageSender._subscriptions[message.code]
    if (nodes === undefined)
      return undefined
    nodes.forEach(node => {
      if (message.priority === MessagePriority.NORMAL)
        MessageSender._normalMessageQueue.push(new MessageQueueNode(message, node.handler, node.callback))
      else if (message.priority === MessagePriority.HIGH && node.handler !== undefined)
        node.handler.onMessage(message)
      else if (message.priority === MessagePriority.HIGH && node.callback !== undefined)
        node.callback(message)
      else
        console.log("There is no hander OR callback for message code: " + message.code)
    })
  }

  /** Performs update routines on this message sender. */
  public static update(): void {
    if (!MessageSender._normalMessageQueue.length)
      return undefined
    const messageLimit = Math.min(MessageSender._normalQueueMessagePerUpdate, MessageSender._normalMessageQueue.length)
    for (let i = 0; i < messageLimit; ++i) {
      const node = MessageSender._normalMessageQueue.pop()
      if (node.handler !== undefined)
        node.handler.onMessage(node.message)
      else if (node.callback !== undefined)
        node.callback(node.message)
      else
        console.warn("Unable to process message node because there is no handler or callback: " + node)
    }
  }
}