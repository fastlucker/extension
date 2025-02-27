export function stripTopicDirection(topic: string) {
  if (topic.startsWith('>') || topic.startsWith('<')) {
    return topic.slice(1).trimStart()
  }
  return topic
}
