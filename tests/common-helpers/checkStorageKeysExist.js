export async function checkStorageKeysExist(serviceWorker, keys) {
  const keysArray = Array.isArray(keys) ? keys : [keys]

  const storageData = await serviceWorker.evaluate(() => chrome.storage.local.get())

  const storageKeys = Object.keys(storageData)

  return keysArray.every((key) => storageKeys.includes(key))
}
