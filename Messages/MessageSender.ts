import Dictionary from '../Core/Dictionary'
import MessageSubscription from './MessageSubscription'
import MessagePriority from './MessagePriority'
import MessageCallback from './MessageCallback'
import MessageQueue from './MessageQueue'
import Message from './Message'

export default abstract class MessageSender {
  private static _subscriptions: Dictionary<Array<MessageSubscription>> = {}
  private static _normalQueueMessagePerUpdate: number = 10
  private static _normalMessageQueue: Array<MessageQueue> = []

  /**
   * Adds a subscription to the provided code using the provided handler.
   * @param code The code to listen for.
   * @param callback The message callback.
   */
  public static addSubscription(code: string, callback: MessageCallback): void {
    if (this._subscriptions[code] === undefined)
      this._subscriptions[code] = []
    if (callback === undefined)
      return console.warn("Cannot add subscription where callback is undefined.")
    if (this._subscriptions[code].find(subscription => subscription.callback === callback))
      return console.warn("Attempting to add a duplicate callback to code: " + code + ". Subscription not added.")
    this._subscriptions[code].push(new MessageSubscription(code, callback))
  }

  /**
   * Removes a subscription to the provided code using the provided handler.
   * @param code The code to no longer listen for.
   * @param callback The message callback.
   */
  public static removeSubscription(code: string, callback: MessageCallback): void {
    if (this._subscriptions[code] === undefined)
      return console.warn("Cannot remove subscription from code: " + code + " Because that code is not subscribed to.")
    if (callback === undefined)
      return console.warn("Cannot remove subscription where callback is undefined.")

    this._subscriptions[code].filter(subscription => subscription.callback !== callback)
  }

  /**
   * Posts the provided message to the message system.
   * @param message The message to be sent.
   */
  public static post(message: Message): void {
    if (this._subscriptions[message.code] === undefined)
      return undefined

    this._subscriptions[message.code].map(subscription => {
      if (message.priority === MessagePriority.NORMAL)
        return this._normalMessageQueue.push(new MessageQueue(message, subscription.callback))
      if (message.priority === MessagePriority.HIGH && subscription.callback !== undefined)
        return subscription.callback(message)
      return console.warn("There is no callback for message code: " + message.code)
    })
  }

  /** Performs update routines on message sender. */
  public static update(): void {
    if (!this._normalMessageQueue.length)
      return undefined
    const messageLimit = Math.min(MessageSender._normalQueueMessagePerUpdate, MessageSender._normalMessageQueue.length)
    const messages = this._normalMessageQueue.filter((queue, index) => index < messageLimit)
    this._normalMessageQueue = this._normalMessageQueue.filter((queue, index) => index > messageLimit)
    messages.map(message => {
      if (message.callback !== undefined)
        return message.callback(message.message)
      return console.warn("Unable to process message node because there is no callback: " + message)
    })
  }
}