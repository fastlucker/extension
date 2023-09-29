import { fetchCaught } from '@common/services/fetch'

import { CollectibleData } from '../types'

const fetchCollectible = async (url: string): Promise<CollectibleData | null> =>
  fetchCaught(url).then((resp) => {
    const body = resp.body

    if (typeof body !== 'object' || body === null || !('image' in body)) return null

    return resp.body as CollectibleData
  })

export default fetchCollectible
