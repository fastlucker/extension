import { getBytes, isBytesLike, toUtf8Bytes, toUtf8String } from 'ethers'

import { Hex } from '@ambire-common/interfaces/hex'

// TODO: Check everywhere where we use this function, if we pass a hex string
const getMessageAsText = (msg: Hex): string => {
  // FIXME: This can also throw, if it throws, what should we do?
  const bytes = getBytes(isBytesLike(msg) ? msg : toUtf8Bytes(msg))

  const expectedPortionOfValidChars = 0.9
  const numberOfValidCharacters = bytes.filter((x) => x >= 0x20 && x <= 0x7e).length

  if (bytes.length * expectedPortionOfValidChars < numberOfValidCharacters) {
    try {
      return toUtf8String(msg)
    } catch (_) {
      // What should we return if it's BytesLike, but toUtf8String still throws?
      return isBytesLike(msg) ? 'TODO: fallback?' : msg
    }
  }

  // TODO: Is this fallback to everything?
  return `Hex message:\n${msg}`
}
interface TypedMessageVisualization {
  type: 'key' | 'value'
  value: any
  n: number
}
const simplifyTypedMessage = (value: any, n = 0): TypedMessageVisualization[] => {
  const res: TypedMessageVisualization[] = []
  if (Array.isArray(value)) {
    value.forEach((i) => {
      res.push(...simplifyTypedMessage(i, n + 1))
    })
    return res
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((k) => {
      res.push({ type: 'key', value: k, n })
      res.push(...simplifyTypedMessage(value[k], n + 1))
    })
    return res
  }
  return [{ type: 'value', value, n }]
}

export { getMessageAsText, simplifyTypedMessage }
