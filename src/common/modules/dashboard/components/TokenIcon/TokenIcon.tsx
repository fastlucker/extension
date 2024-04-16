import React, { useCallback, useMemo, useState } from 'react'
import { Image, ImageProps, View } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Spinner from '@common/components/Spinner'
import useTheme from '@common/hooks/useTheme'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

interface Props extends Partial<ImageProps> {
  networkId?: string
  address?: string
  withContainer?: boolean
  containerWidth?: number
  containerHeight?: number
  width?: number
  height?: number
  onGasTank?: boolean
  networkSize?: number
  uri?: string
}

const TokenIcon: React.FC<Props> = ({
  networkId = '',
  address = '',
  withContainer = false,
  containerWidth = 34,
  containerHeight = 34,
  width = 20,
  height = 20,
  onGasTank = false,
  networkSize = 14,
  ...props
}) => {
  const { theme, styles } = useTheme(getStyles)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>()
  const { networks } = useSettingsControllerState()

  const network = useMemo(
    () =>
      networks
        ? networks.find((net) => net.id === networkId)
        : predefinedNetworks.find((net) => net.id === networkId),
    [networkId, networks]
  )

  const imageUrl = useMemo(() => {
    if (!network) return undefined

    return `https://cena.ambire.com/iconProxy/${network.platformId}/${address}`
  }, [address, network])

  const containerStyle = useMemo(
    () =>
      withContainer && [
        {
          width: containerWidth,
          height: containerHeight,
          backgroundColor: theme.secondaryBackground,
          ...common.borderRadiusPrimary,
          ...flexbox.alignCenter,
          ...flexbox.justifyCenter
        }
      ],
    [containerHeight, containerWidth, withContainer, theme.secondaryBackground]
  )

  const setLoadingFinished = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setShowFallbackImage = useCallback(() => {
    setHasError(true)
  }, [])

  return (
    <View style={containerStyle}>
      {!!isLoading && !hasError && (
        <View style={styles.loader}>
          <Spinner style={{ width, height }} />
        </View>
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
          width={withContainer ? containerWidth : width * 1.3}
          height={withContainer ? containerHeight : height * 1.3}
        />
      )}
      <View
        style={[
          styles.networkIconWrapper,
          !withContainer && {
            left: -3,
            top: -3
          }
        ]}
      >
        {!!networkId && (
          <NetworkIcon
            id={!onGasTank ? networkId : 'gasTank'}
            size={networkSize}
            style={styles.networkIcon}
          />
        )}
      </View>
    </View>
  )
}

export default React.memo(TokenIcon)
