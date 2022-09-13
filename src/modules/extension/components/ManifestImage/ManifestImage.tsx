import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'

import Spinner from '@modules/common/components/Spinner'
import colors from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

type Props = {
  host: any
  fallback?: () => any
  size: number
}

const ManifestImage = ({ host, fallback, size = 64 }: Props) => {
  const [failedCount, setFailedCount] = useState(0)
  const [iconsList, setIconsList] = useState([])
  const [loading, setIsLoading] = useState(true)

  useEffect(() => {
    // enforcing https by default?
    fetch(`https://${host}/manifest.json`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json;charset=UTF-8' }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        return response.json()
      })
      .then((json) => {
        setIsLoading(false)
        if (json.icons && Array.isArray(json.icons)) {
          setIconsList(
            json.icons
              .sort((a, b) => parseInt(a.size) - parseInt(b.size))
              .slice(0, 20)
              .map((i) => `https://${host}/${i.src.replace(/^\//, '')}`)
          )
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [host])

  return (
    <View
      style={[
        flexboxStyles.alignCenter,
        flexboxStyles.justifyCenter,
        commonStyles.borderRadiusPrimary,
        { width: size, height: size, backgroundColor: colors.chetwode }
      ]}
    >
      {!!loading && <Spinner />}

      {!loading && (failedCount >= iconsList.length || !iconsList.length) && !!fallback && fallback}
      {!loading && !(failedCount >= iconsList.length || !iconsList.length) && (
        <Image
          source={{ uri: iconsList[failedCount] }}
          style={{
            width: size,
            height: size
          }}
          onError={() => {
            setFailedCount((prev) => prev + 1)
          }}
        />
      )}
    </View>
  )
}

export default ManifestImage
