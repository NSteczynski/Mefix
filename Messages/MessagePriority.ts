/** Represents message priorities. */
enum MessagePriority {
  /** Normal message priority, meaning the message is sent as soon as the queue allows. */
  NORMAL,
  /** High message priority, meaning the message is sent immediately. */
  HIGH
}

export default MessagePriority