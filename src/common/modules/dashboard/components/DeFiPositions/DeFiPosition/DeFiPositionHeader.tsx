import React, { FC } from 'react'
import { Animated, View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { Position } from '@ambire-common/libs/defiPositions/types'
import AaveIcon from '@common/assets/svg/AaveIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import UniswapIcon from '@common/assets/svg/UniswapIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

type Props = Omit<Position, 'assets' | 'positionType'> & {
  toggleExpanded: () => void
  isExpanded: boolean
  positionInUSD?: string
}

const POSITION_TO_ICON: {
  [key: string]: FC
} = {
  'Uniswap V3': UniswapIcon,
  'Uniswap V2': UniswapIcon,
  'AAVE v3': AaveIcon,
  'AAVE v2': AaveIcon,
  'AAVE v1': AaveIcon
}

const Badge = ({ text, type }: { text: string; type: 'primary' | 'secondary' }) => {
  const { theme } = useTheme()
  return (
    <View
      style={{
        ...spacings.phTy,
        ...flexbox.justifyCenter,
        height: 28,
        borderRadius: 14,
        backgroundColor: type === 'primary' ? theme.successBackground : theme.infoBackground
      }}
    >
      <Text
        fontSize={12}
        weight="medium"
        appearance={type === 'primary' ? 'successText' : 'infoText'}
      >
        {text}
      </Text>
    </View>
  )
}

const ProtocolIcon = ({
  providerName,
  networkId
}: {
  providerName: string
  networkId: Network['id']
}) => {
  const { theme } = useTheme()
  const Icon = POSITION_TO_ICON[providerName]

  return (
    <View style={spacings.mrSm}>
      <Icon />
      <NetworkIcon
        style={{
          backgroundColor: theme.primaryBackground,
          position: 'absolute',
          left: -8,
          top: -4
        }}
        scale={1}
        id={networkId}
        size={20}
      />
    </View>
  )
}

const DeFiPositionHeader: FC<Props> = ({
  providerName,
  toggleExpanded,
  network,
  positionInUSD,
  isExpanded,
  additionalData
}) => {
  const { styles, theme } = useTheme(getStyles)
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: isExpanded ? theme.quaternaryBackground : theme.secondaryBackground
    },
    forceHoveredStyle: isExpanded
  })

  const { healthRate, APY } = additionalData || {}

  return (
    <AnimatedPressable
      onPress={toggleExpanded}
      style={[styles.header, isExpanded ? styles.expandedHeaderStyle : {}, animStyle]}
      {...bindAnim}
    >
      <View style={styles.providerData}>
        {/* TODO: Replace hard-coded networkId  */}
        <ProtocolIcon providerName={providerName} networkId="optimism" />
        <Text fontSize={16} weight="semiBold" style={spacings.mrMi}>
          {providerName}
        </Text>
        <OpenIcon width={14} height={14} color={theme.secondaryText} />
        <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mlLg]}>
          {healthRate && (
            <Badge text={`Health Rate: ${formatDecimals(healthRate)}`} type="primary" />
          )}
          {APY && <Badge text={`Total APY: ${formatDecimals(APY)}`} type="secondary" />}
        </View>
      </View>
      <View style={styles.positionData}>
        <Text fontSize={16} weight="semiBold" style={spacings.mrSm}>
          {positionInUSD}
        </Text>
        <Animated.View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
          <DownArrowIcon color={theme.secondaryText} />
        </Animated.View>
      </View>
    </AnimatedPressable>
  )
}

export default DeFiPositionHeader
