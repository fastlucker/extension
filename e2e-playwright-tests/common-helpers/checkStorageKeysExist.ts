export async function checkStorageKeysExist(serviceWorker, keys) {
  const keysArray = Array.isArray(keys) ? keys : [keys]

  // @ts-expect-error: chrome is injected by the browser
  const storageData = await serviceWorker.evaluate(() => chrome.storage.local.get())

  const storageKeys = Object.keys(storageData)

  return keysArray.every((key) => storageKeys.includes(key))
}
