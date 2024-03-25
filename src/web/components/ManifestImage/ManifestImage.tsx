import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import commonStyles from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import { checkIfImageExists } from '@common/utils/checkIfImageExists'

type Props = {
  uri?: string
  uris?: string[]
  fallback?: () => any
  size: number
  isRound?: boolean
  iconScale?: number
}

const ManifestImage = ({ uri, uris = [], fallback, size = 64, isRound, iconScale = 1 }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [validUri, setValidUri] = useState('')

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      if (uris?.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const u of uris) {
          // eslint-disable-next-line no-await-in-loop
          const hasLoadedUri = await checkIfImageExists(u)
          if (hasLoadedUri) {
            setValidUri(u) // the `hasLoadedUri` handles if `uri` is defined
            break
          }
        }
      }

      if (uri) {
        const hasLoadedUri = await checkIfImageExists(uri)
        if (hasLoadedUri) {
          setValidUri(uri as string) // the `hasLoadedUri` handles if `uri` is defined
        }
      }
      setIsLoading(false)
    })()
  }, [uri, uris])

  return (
    <View
      style={[
        flexboxStyles.alignCenter,
        flexboxStyles.justifyCenter,
        commonStyles.borderRadiusPrimary,
        commonStyles.hidden,
        !!isRound && { borderRadius: 50 },
        { width: size, height: size }
      ]}
    >
      {!!isLoading && <Spinner style={{ width: size * iconScale, height: size * iconScale }} />}
      {!isLoading && !validUri && !!fallback && fallback()}
      {!isLoading && !!validUri && (
        <Image
          source={{ uri: validUri }}
          style={[
            {
              width: size * iconScale,
              height: size * iconScale
            },
            !!isRound && { borderRadius: 50 }
          ]}
        />
      )}
    </View>
  )
}

export default React.memo(ManifestImage)
