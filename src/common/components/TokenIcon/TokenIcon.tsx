import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, ImageProps, View, ViewStyle } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import useTheme from '@common/hooks/useTheme'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

import SkeletonLoader from '../SkeletonLoader'
import { SkeletonLoaderProps } from '../SkeletonLoader/types'
import getStyles from './styles'

interface Props extends Partial<ImageProps> {
  networkId?: string
  chainId?: number
  address?: string
  containerStyle?: ViewStyle
  withContainer?: boolean
  withNetworkIcon?: boolean
  containerWidth?: number
  containerHeight?: number
  width?: number
  height?: number
  onGasTank?: boolean
  networkSize?: number
  uri?: string
  skeletonAppearance?: SkeletonLoaderProps['appearance']
}

const TokenIcon: React.FC<Props> = ({
  networkId = '',
  chainId,
  address = '',
  uri,
  withContainer = false,
  withNetworkIcon = true,
  containerWidth = 34,
  containerHeight = 34,
  containerStyle,
  width = 20,
  height = 20,
  onGasTank = false,
  networkSize = 14,
  skeletonAppearance = 'primaryBackground',
  ...props
}) => {
  const { theme, styles } = useTheme(getStyles)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const { networks } = useNetworksControllerState()

  useEffect(() => {
    setHasError(false)
  }, [uri])

  const network = useMemo(
    () =>
      networks
        ? networks.find((net) => net.id === networkId || Number(net.chainId) === chainId)
        : predefinedNetworks.find((net) => net.id === networkId),
    [networkId, chainId, networks]
  )

  const imageUrl = useMemo(() => {
    if (uri) return uri
    if (!network || !network.platformId) {
      setHasError(true)
      return undefined
    }
    setHasError(false)
    return `https://cena.ambire.com/iconProxy/${network.platformId}/${address}`
  }, [address, network, uri])

  const allContainerStyle = useMemo(
    () => [
      containerStyle,
      ...(withContainer
        ? [
            {
              width: containerWidth,
              height: containerHeight,
              backgroundColor: theme.secondaryBackground,
              ...common.borderRadiusPrimary,
              ...flexbox.alignCenter,
              ...flexbox.justifyCenter
            }
          ]
        : [])
    ],
    [containerStyle, withContainer, containerWidth, containerHeight, theme.secondaryBackground]
  )
  const setLoadingFinished = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setShowFallbackImage = useCallback(() => {
    setHasError(true)
  }, [])

  return (
    <View style={allContainerStyle}>
      {!!isLoading && !hasError && (
        <SkeletonLoader
          width={width}
          height={height}
          style={styles.loader}
          appearance={skeletonAppearance}
        />
      )}
      {!!imageUrl && !hasError && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width, height, borderRadius: BORDER_RADIUS_PRIMARY }}
          onError={setShowFallbackImage}
          onLoadEnd={setLoadingFinished}
          {...props}
        />
      )}
      {!!hasError && (
        <MissingTokenIcon
          withRect={withContainer}
          // A bit larger when they don't have a container,
          // because the SVG sizings are made with rectangle in mind
          width={withContainer ? containerWidth : width}
          height={withContainer ? containerHeight : height}
        />
      )}
      {networkId && withNetworkIcon ? (
        <View
          style={[
            styles.networkIconWrapper,
            !withContainer && {
              left: -3,
              top: -3
            }
          ]}
        >
          <NetworkIcon
            id={!onGasTank ? networkId : 'gasTank'}
            size={networkSize}
            style={styles.networkIcon}
          />
        </View>
      ) : null}
    </View>
  )
}

export default React.memo(TokenIcon)
