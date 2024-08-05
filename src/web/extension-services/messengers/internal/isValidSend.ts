import { SendMessage } from '@web/extension-services/messengers/internal/createMessenger'

export function isValidSend({ topic, message }: { topic: string; message: SendMessage<unknown> }) {
  if (!message) return
  if (!message.topic) return false
  if (topic !== '*' && message.topic !== `> ${topic}`) return false
  if (topic === '*' && message.topic.startsWith('<')) return false
  return true
}
