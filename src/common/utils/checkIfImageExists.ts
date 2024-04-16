/**
 * Check if an image exists or not using the ES6 Fetch API
 * {@link https://stackoverflow.com/a/56196999/1333836}
 */
export const checkIfImageExists = (uri?: string) => {
  if (!uri) return Promise.resolve(false)

  return fetch(uri, {
    // Only retrieves headers, which is enough to check the image existence.
    method: 'HEAD'
  })
    .then((res) => {
      if (res.ok) return Promise.resolve(true)

      return Promise.resolve(false)
    })
    .catch(() => Promise.resolve(false))
}

// try to fetch the token icon from cena.ambire.com
// if it fails, return null
export async function fetchImageFromCena(uri: string): Promise<string | null> {
  try {
    const cenaResult = await fetch(uri, {
      mode: 'cors'
    })
    if (cenaResult.status !== 404) return cenaResult.url
    return null
  } catch (e) {
    return null
  }
}
