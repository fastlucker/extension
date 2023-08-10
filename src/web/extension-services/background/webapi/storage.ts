import { Storage } from 'ambire-common/src/interfaces/storage'
import { parse, stringify } from 'ambire-common/src/libs/bigintJson/bigintJson'

export const get = async (key?: string, defaultValue?: any) => {
  const res = await browser.storage.local.get(null as any)

  if (!res[key]) {
    return defaultValue
  }

  try {
    return key ? (typeof res[key] === 'string' ? parse(res[key]) : res[key]) : res
  } catch (error) {
    return defaultValue
  }
}

export const set = async (key: string, value: any): Promise<null> => {
  await browser.storage.local.set({
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
