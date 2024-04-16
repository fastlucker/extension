import React, { useEffect, useMemo, useState } from 'react'
import { Image, ImageProps, ImageStyle, View } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import Spinner from '../Spinner'
import styles from './styles'

interface Props extends Partial<ImageProps> {
  networkId?: string
  address?: string
  withContainer?: boolean
  containerWidth?: number
  containerHeight?: number
  width?: number
  height?: number
  style: ImageStyle
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
  const [isLoading, setIsLoading] = useState(true)
  const [validUri, setValidUri] = useState('')
  const { networks } = useSettingsControllerState()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      if (validUri === 'not-found') return

      // if we're in the extension, we have settings networks => we load from there
      // if benzina, we don't => we load from predefined
      // this will affect custom networks in benzina but the external benzin
      // doesn't work with custom networks at the moment
      const network = networks
        ? networks.find((net) => net.id === networkId)
        : predefinedNetworks.find((net) => net.id === networkId)
      if (network) {
        setValidUri(`https://cena.ambire.com/iconProxy/${network.platformId}/${address}`)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    })()
  }, [address, networkId, networks, validUri])

  const containerStyle = useMemo(
    () => withContainer && [styles.container, { width: containerWidth, height: containerHeight }],
    [containerHeight, containerWidth, withContainer]
  )

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <Spinner style={{ width: 24, height: 24 }} />
      </View>
    )
  }

  return validUri && validUri !== 'not-found' ? (
    <View style={containerStyle || {}}>
      <Image
        source={{ uri: validUri }}
        style={{ width, height, borderRadius: width / 2, ...style }}
        onError={() => setValidUri('not-found')}
        {...props}
      />
    </View>
  ) : (
    <MissingTokenIcon
      withRect={withContainer}
      // A bit larger when they don't have a container,
      // because the SVG sizings are made with rectangle in mind
      width={withContainer ? containerWidth : width * 1.3}
      height={withContainer ? containerHeight : height * 1.3}
    />
  )
}

export default React.memo(TokenIcon)
