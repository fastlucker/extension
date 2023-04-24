import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

const get = async (prop?) => {
  const keys = storage.getAllKeys()
  const result: any = {}
  if (keys) {
    keys.forEach((key) => {
      result[key] = storage.getString(key)
    })
  }

  return prop ? storage.getString(prop) : result
}

const set = async (prop, value): Promise<void> => {
  let val
  if (typeof value === 'string') {
    val = value
  } else {
    val = JSON.stringify(value)
  }

  storage.set(prop, val)
}

const byteInUse = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (chrome) {
      chrome.storage.local.getBytesInUse((value) => {
        resolve(value)
      })
    } else {
      reject('ByteInUse only works in Chrome')
    }
  })
}

export default {
  get,
  set,
  byteInUse
}
