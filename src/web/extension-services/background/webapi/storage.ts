import { Storage } from 'ambire-common/src/interfaces/storage'

const get = async (prop?: string) => {
  const result = await browser.storage.local.get(null)
  return prop ? result?.[prop] : result
}

const set = async (key: string, value: any): Promise<null> => {
  await browser.storage.local.set({ [key]: value })
  return null
}

const storage: Storage = {
  get,
  set
}

export default {
  get,
  set,
  storage
}
