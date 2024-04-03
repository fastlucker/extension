import { Storage } from '@ambire-common/interfaces/storage'
import { HUMANIZER_META_KEY } from '@ambire-common/libs/humanizer'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { browser, isExtension } from '@web/constants/browserapi'
import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'

const benzinaMap = new Map()
benzinaMap.set(HUMANIZER_META_KEY, stringify(humanizerInfo))

const benzinaStorage = {
  get: (key: string, defaultValue: any): any => {
    const serialized = benzinaMap.get(key)
    return Promise.resolve(serialized ? parse(serialized) : defaultValue)
  },
  set: (key: string, value: any) => {
    benzinaMap.set(key, stringify(value))
    return Promise.resolve(null)
  }
}

export const get = async (key?: string, defaultValue?: any) => {
  const res = await browser.storage.local.get(null)

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
  await browser.storage.local.set({
    [key]: typeof value === 'string' ? value : stringify(value)
  })
  return null
}

export const storage: Storage = isExtension
  ? {
      get,
      set
    }
  : benzinaStorage

export default {
  get,
  set,
  storage
}
