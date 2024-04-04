import React, { useEffect, useMemo, useState } from 'react'
import { Image, ImageProps, ImageStyle, View } from 'react-native'

import { getIconId } from '@ambire-common/libs/portfolio/icons'
import MissingTokenIcon from '@common/assets/svg/MissingTokenIcon'
import { checkIfImageExists } from '@common/utils/checkIfImageExists'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Spinner from '../Spinner'
import styles from './styles'

interface Props extends Partial<ImageProps> {
  uri?: string
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
  const [uri, setUri] = useState('')
  const { state } = usePortfolioControllerState()

  useEffect(() => {
    if (state.tokenIcons && !uri) {
      const iconId = getIconId(networkId, address)
      !!iconId && setUri(state.tokenIcons[iconId])
    }
  }, [state.tokenIcons, uri, networkId, address])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const hasLoadedUri = await checkIfImageExists(uri)
      if (hasLoadedUri) {
        setValidUri(uri as string) // the `hasLoadedUri` handles if `uri` is defined
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    })()
  }, [address, networkId, uri])

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

  return validUri ? (
    <View style={containerStyle || {}}>
      <Image
        source={{ uri: validUri }}
        style={{ width, height, borderRadius: width / 2, ...style }}
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
