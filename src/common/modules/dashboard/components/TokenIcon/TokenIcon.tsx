import React, { useEffect, useMemo, useState } from 'react'
import { Image, ImageProps, View } from 'react-native'

import GasTankIcon from '@common/assets/svg/GasTankIcon'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Spinner from '@common/components/Spinner'
import useTheme from '@common/hooks/useTheme'
import { getTokenIcon } from '@common/services/icons'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { checkIfImageExists } from '@common/utils/checkIfImageExists'

import getStyles from './styles'

interface Props extends Partial<ImageProps> {
  uri?: string
  networkId?: string
  address?: string
  withContainer?: boolean
  containerWidth?: number
  containerHeight?: number
  width?: number
  height?: number
  onGasTank?: boolean
  networkSize?: number
}

const TokenIcon: React.FC<Props> = ({
  uri,
  networkId = '',
  address = '',
  withContainer = false,
  containerWidth = 35,
  containerHeight = 35,
  width = 20,
  height = 20,
  onGasTank = false,
  networkSize = 14,
  ...props
}) => {
  const { theme, styles } = useTheme(getStyles)
  const [isLoading, setIsLoading] = useState(true)
  const [validUri, setValidUri] = useState('')

  useEffect(() => {
    ;(async () => {
      const hasLoadedUri = await checkIfImageExists(uri)
      if (hasLoadedUri) {
        setValidUri(uri as string) // the `hasLoadedUri` handles if `uri` is defined
        setIsLoading(false)
        return
      }

      const alternativeUri = getTokenIcon(networkId, address)
      const hasLoadedFallbackUri = await checkIfImageExists(alternativeUri)
      if (hasLoadedFallbackUri) {
        setValidUri(alternativeUri)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    })()
  }, [address, networkId, uri])

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

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <Spinner style={{ width: 24, height: 24 }} />
      </View>
    )
  }

  return (
    <View style={containerStyle}>
      {validUri ? (
        <Image
          source={{ uri: validUri }}
          style={{ width, height, borderRadius: BORDER_RADIUS_PRIMARY }}
          {...props}
        />
      ) : (
        <MissingTokenIcon
          withRect={withContainer}
          // A bit larger when they don't have a container,
          // because the SVG sizings are made with rectangle in mind
          width={withContainer ? containerWidth : width * 1.3}
          height={withContainer ? containerHeight : height * 1.3}
        />
      )}
      <View style={styles.networkIconWrapper}>
        {onGasTank && (
          <GasTankIcon width={networkSize} height={networkSize} color={theme.primary} />
        )}
        {!!networkId && (
          <NetworkIcon
            name={networkId}
            style={[
              styles.networkIcon,
              {
                width: networkSize,
                height: networkSize
              }
            ]}
          />
        )}
      </View>
    </View>
  )
}

export default TokenIcon
