import React, { useState } from 'react'
import { Image, ImageProps, View } from 'react-native'

import MissingTokenIcon from '@assets/svg/MissingTokenIcon'
import { getTokenIcon } from '@modules/common/services/icons'

import styles from './styles'

interface Props extends Partial<ImageProps> {
  uri?: string
  networkId?: string
  address?: string
  withContainer?: boolean
}

const TokenIcon: React.FC<Props> = ({
  uri,
  networkId = '',
  address = '',
  withContainer = false,
  ...props
}) => {
  const [failedImg, setFailedImg] = useState(!uri)
  const [failedImgFallback, setFailedImgFallback] = useState(false)

  return failedImg && failedImgFallback ? (
    <MissingTokenIcon />
  ) : (
    <View style={withContainer && styles.container}>
      {failedImg ? (
        <Image
          source={{ uri: getTokenIcon(networkId, address) }}
          onError={() => setFailedImgFallback(true)}
          style={styles.img}
          {...props}
        />
      ) : (
        <Image source={{ uri }} onError={() => setFailedImg(true)} style={styles.img} {...props} />
      )}
    </View>
  )
}

export default TokenIcon
