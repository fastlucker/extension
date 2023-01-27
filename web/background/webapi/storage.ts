const get = async (prop?) => {
  const result = await browser.storage.local.get(null)
  return prop ? result?.[prop] : result
}

const set = async (prop, value): Promise<void> => {
  await browser.storage.local.set({ [prop]: value })
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
