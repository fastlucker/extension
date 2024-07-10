import { toUtf8String } from 'ethers'

const getMessageAsText = (msg: any) => {
  try {
    return toUtf8String(msg)
  } catch (_) {
    return msg
  }
}

const normiefyTypedMessage = (key: string, value: any, n = 0): string => {
  const indentation = '   '
  const offset = indentation.repeat(n)
  if (Array.isArray(value)) {
    return `${key} = [\n${value
      .map((i) => `${`${offset}`}${normiefyTypedMessage('', i, n + 1)}`)
      .join('\n')}\n]`
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]: [string, any]) => {
        return offset + normiefyTypedMessage(k, v, n + 1)
      })
      .join('\n')
  }
  return key ? `${key} = ${value}` : value
}

export { getMessageAsText, normiefyTypedMessage }
