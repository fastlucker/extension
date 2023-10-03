import { toUtf8String } from 'ethers'

const getMessageAsText = (msg: any) => {
  try {
    return toUtf8String(msg)
  } catch (_) {
    return msg
  }
}

export { getMessageAsText }
