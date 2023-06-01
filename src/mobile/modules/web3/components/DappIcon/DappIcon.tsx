import React from 'react'
import { View } from 'react-native'
import ErrorBoundary from 'react-native-error-boundary'
import { SvgUri } from 'react-native-svg'

import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import SearchIcon from '@common/assets/svg/SearchIcon'
import FastImage from '@common/components/FastImage'
import colors from '@common/styles/colors'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

type Props = {
  iconUrl: string
  size?: number
  isSearchIcon?: boolean
}

const DappIcon = ({ iconUrl, size = 64, isSearchIcon }: Props) => {
  if (isSearchIcon)
    return (
      <View
        style={
          [
            common.borderRadiusPrimary,
            flexbox.justifyCenter,
            flexbox.alignCenter,
            { width: size, height: size, backgroundColor: colors.chetwode }
          ] as any
        }
      >
        <SearchIcon width={20} height={20} />
      </View>
    )

  if (!iconUrl) return <ManifestFallbackIcon width={size} height={size} />

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
