import { getBytes, isBytesLike, toUtf8Bytes, toUtf8String } from 'ethers'

import { Hex } from '@ambire-common/interfaces/hex'
import { captureException } from '@common/config/analytics/CrashAnalytics.web'

const getMessageAsText = (msg: Hex): string => {
  const bytes = getBytes(msg)

  const expectedPortionOfValidChars = 0.9
  const numberOfValidCharacters = bytes.filter((x) => x >= 0x20 && x <= 0x7e).length

  if (bytes.length * expectedPortionOfValidChars < numberOfValidCharacters) {
    try {
      return toUtf8String(msg)
    } catch (e) {
      captureException(e, {
        extra: {
          context: 'Failed to convert incoming hex string to utf8 string',
          incomingHex: msg
        }
      })

      // Attempt to sign the message anyways
      return msg
    }
  }

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
