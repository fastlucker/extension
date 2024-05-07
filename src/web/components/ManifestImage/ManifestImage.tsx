import React, { useCallback, useState } from 'react'
import { Image, View } from 'react-native'

import SkeletonLoader from '@common/components/SkeletonLoader'
import useTheme from '@common/hooks/useTheme'
import commonStyles from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'

type Props = {
  uri?: string
  uris?: string[]
  fallback?: () => any
  size: number
  isRound?: boolean
  iconScale?: number
}

const ManifestImage = ({ uri, uris = [], fallback, size = 64, isRound, iconScale = 1 }: Props) => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentUri, setCurrentUri] = useState({
    index: 0,
    uri: uri || uris[0]
  })
  const scaledSize = size * iconScale

  const onError = useCallback(() => {
    setHasError(true)

    if (uris.length && uris.length > 1 && currentUri.index < uris.length - 1) {
      setCurrentUri({
        index: currentUri.index + 1,
        uri: uris[currentUri.index + 1]
      })
    }
  }, [currentUri.index, uris])

  const onLoadEnd = useCallback(() => setIsLoading(false), [])

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
      {isLoading && (
        <SkeletonLoader
          width={scaledSize}
          height={scaledSize}
          style={{
            position: 'absolute',
            zIndex: 3
          }}
        />
      )}
      {!isLoading && hasError && !!fallback && fallback()}
      {!!currentUri.uri && !hasError && (
        <Image
          source={{ uri: currentUri.uri }}
          onError={onError}
          onLoadEnd={onLoadEnd}
          resizeMode="contain"
          style={[
            {
              height: scaledSize,
              width: scaledSize,
              backgroundColor: theme.primaryBackground
            },
            !!isRound && { borderRadius: scaledSize / 2 }
          ]}
        />
      )}
    </View>
  )
}

export default React.memo(ManifestImage)
