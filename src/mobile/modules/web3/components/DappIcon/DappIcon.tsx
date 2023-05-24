import React from 'react'
import { View } from 'react-native'
import ErrorBoundary from 'react-native-error-boundary'
import { SvgUri } from 'react-native-svg'

import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import FastImage from '@common/components/FastImage'
import common from '@common/styles/utils/common'

type Props = {
  iconUrl: string
  size?: number
}

const DappIcon = ({ iconUrl, size = 64 }: Props) => {
  if (!iconUrl) return <ManifestFallbackIcon />

  if (iconUrl.endsWith('.svg')) {
    return (
      <View style={[common.borderRadiusPrimary, common.hidden]}>
        <ErrorBoundary FallbackComponent={() => <ManifestFallbackIcon />}>
          <SvgUri width={size} height={size} uri={iconUrl} />
        </ErrorBoundary>
      </View>
    )
  }

  return (
    <FastImage
      style={[common.borderRadiusPrimary, { width: size, height: size }] as any}
      source={{ uri: iconUrl }}
    />
  )
}

export default DappIcon
