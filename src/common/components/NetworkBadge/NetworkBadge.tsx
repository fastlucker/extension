import React, { FC, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import Text, { TextWeight } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

import NetworkIcon from '../NetworkIcon'

interface Props {
  chainId?: bigint
  withOnPrefix?: boolean
  style?: ViewStyle
  fontSize?: number
  weight?: TextWeight
  iconSize?: number
}

const NetworkBadge: FC<Props> = ({
  chainId,
  withOnPrefix,
  style,
  fontSize = 16,
  weight,
  iconSize = 32
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { networks } = useNetworksControllerState()

  const network = useMemo(() => {
    return networks.find((n) => n.chainId === chainId)
  }, [chainId, networks])

  if (!chainId) return null

  return (
    <View
      style={{
        ...flexbox.directionRow,
        ...flexbox.alignCenter,
        ...spacings.pl,
        ...spacings.prTy,
        ...spacings.pvMi,
        borderRadius: BORDER_RADIUS_PRIMARY,
        backgroundColor: theme.secondaryBackground,
        ...style
      }}
    >
      <Text fontSize={fontSize} weight={weight || 'medium'} appearance="secondaryText">
        {withOnPrefix ? (
          <Text fontSize={fontSize} weight={weight || 'medium'} appearance="tertiaryText">
            on{' '}
          </Text>
        ) : null}
        {network?.name || t('Unknown network')}
      </Text>
      <NetworkIcon
        style={{ backgroundColor: 'transparent' }}
        id={network?.chainId.toString() || ''}
        size={iconSize}
      />
    </View>
  )
}

export default memo(NetworkBadge)
