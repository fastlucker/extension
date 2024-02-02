import { CollectibleData } from '../types'

const fetchCollectible = async (url: string): Promise<CollectibleData | null> =>
  fetch(url)
    .then((res) => res.json())
    .then((body) => {
      if (typeof body !== 'object' || body === null || !('image' in body)) return null
      return body as unknown as CollectibleData
    })
    .catch(() => null)

export default fetchCollectible
