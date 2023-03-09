import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import commonStyles from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import { checkIfImageExists } from '@common/utils/checkIfImageExists'

type Props = {
  uri: string
  fallback?: () => any
  size: number
}

const ManifestImage = ({ uri, fallback, size = 64 }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [validUri, setValidUri] = useState('')

  useEffect(() => {
    ;(async () => {
      const hasLoadedUri = await checkIfImageExists(uri)
      if (hasLoadedUri) {
        setValidUri(uri as string) // the `hasLoadedUri` handles if `uri` is defined
      }

      setIsLoading(false)
    })()
  }, [uri])

  return (
    <View
      style={[
        flexboxStyles.alignCenter,
        flexboxStyles.justifyCenter,
        commonStyles.borderRadiusPrimary,
        commonStyles.hidden,
        { width: size, height: size }
      ]}
    >
      {!!isLoading && <Spinner />}

      {!isLoading && !validUri && !!fallback && fallback()}
      {!isLoading && !!validUri && (
        <Image
          source={{ uri: validUri }}
          style={{
            width: size,
            height: size
          }}
        />
      )}
    </View>
  )
}

export default ManifestImage
