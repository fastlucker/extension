import React, { useCallback, useMemo, useState } from 'react'
import { Image, ImageProps, ImageStyle, View } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import Spinner from '@common/components/Spinner'
import useTheme from '@common/hooks/useTheme'
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
  style?: ImageStyle
}

const TokenIcon: React.FC<Props> = ({
  networkId = '',
  address = '',
  withContainer = false,
  containerWidth = 34,
  containerHeight = 34,
  width = 22,
  height = 22,
  style = {},
  ...props
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const { networks } = useSettingsControllerState()
  const { styles } = useTheme(getStyles)
  const network = useMemo(
    () =>
      networks
        ? networks.find((net) => net.id === networkId)
        : predefinedNetworks.find((net) => net.id === networkId),
    [networkId, networks]
  )

  const imageUrl = useMemo(() => {
    if (!network) return undefined
    setHasError(false)
    return `https://cena.ambire.com/iconProxy/${network.platformId}/${address}`
  }, [address, network])

  const containerStyle = useMemo(
    () =>
      withContainer ? [styles.container, { width: containerWidth, height: containerHeight }] : {},
    [containerHeight, containerWidth, withContainer, styles]
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
          style={{ width, height, borderRadius: width / 2, ...style }}
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
    </View>
  )
}

export default React.memo(TokenIcon)
