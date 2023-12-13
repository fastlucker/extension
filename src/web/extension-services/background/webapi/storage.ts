import { Storage } from '@ambire-common/interfaces/storage'
import { parse, stringify } from '@ambire-common/libs/bigintJson/bigintJson'
import { browserAPI } from '@web/constants/browserapi'

function getDataFromStorage(): {
  [key: string]: any
} {
  return new Promise((resolve) => {
    browserAPI.storage.local.get(null, (result: { [key: string]: any }) => {
      resolve(result)
    })
  })
}

export const get = async (key?: string, defaultValue?: any) => {
  const res = await getDataFromStorage()

  if (!res[key]) {
    return defaultValue
  }

  try {
    return key ? (typeof res[key] === 'string' ? parse(res[key]) : res[key]) : res
  } catch (error) {
    return typeof res[key] === 'string' ? res[key] : defaultValue
  }
}

export const set = async (key: string, value: any): Promise<null> => {
  await browserAPI.storage.local.set({
    [key]: typeof value === 'string' ? value : stringify(value)
  })
  return null
}

export const storage: Storage = {
  get,
  set
}

export default {
  get,
  set,
  storage
}
