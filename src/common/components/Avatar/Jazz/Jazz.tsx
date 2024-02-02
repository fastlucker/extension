import { Image } from 'react-native'

import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import Jazzicon from '@raugfer/jazzicon'

// builds an image data url for embedding
function buildDataUrl(address: string): string {
  return `data:image/svg+xml;base64,${btoa(Jazzicon(address))}`
}

// sample code for react component
export default function JazzIcon({ address, size }: { address: string; size: number }) {
  const imageUrl = buildDataUrl(address)
  return (
    <Image
      source={{ uri: imageUrl }}
      style={{
        width: size,
        height: size,
        borderRadius: BORDER_RADIUS_PRIMARY
      }}
    />
  )
}
