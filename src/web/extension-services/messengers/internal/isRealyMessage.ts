export function isRelayMessage(type?: string) {
  return ['CS_A_TO_CS_B', 'CS_B_TO_CS_A', 'BROADCAST_CS_B_TO_CS_A'].includes(type || '')
}
