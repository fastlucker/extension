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
  containerWidth?: number
  containerHeight?: number
}

const TokenIcon: React.FC<Props> = ({
  uri,
  networkId = '',
  address = '',
  withContainer = false,
  width = 22,
  height = 22,
  ...props
}) => {
  const [failedImg, setFailedImg] = useState(!uri)
  const [failedImgFallback, setFailedImgFallback] = useState(false)

  return failedImg && failedImgFallback ? (
    <MissingTokenIcon
      withRect={withContainer}
      // A bit larger when they don't have a container,
      // because the SVG sizings are made with rectangle in mind
      width={withContainer ? width : width * 1.3}
      height={withContainer ? height : height * 1.3}
    />
  ) : (
    <View style={withContainer && styles.container}>
      {failedImg ? (
        <Image
          source={{ uri: getTokenIcon(networkId, address) }}
          onError={() => setFailedImgFallback(true)}
          style={{ width, height, borderRadius: width / 2 }}
          {...props}
        />
      ) : (
        <Image
          source={{ uri }}
          onError={() => setFailedImg(true)}
          style={{ width, height, borderRadius: width / 2 }}
          {...props}
        />
      )}
    </View>
  )
}

export default TokenIcon
