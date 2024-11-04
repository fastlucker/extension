import React, { FC } from 'react'
import { Animated, View } from 'react-native'

import { Position } from '@ambire-common/libs/defiPositions/types'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import getStyles from '@common/modules/dashboard/components/DeFiPositions/DeFiPosition/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import Badge from './Badge'
import ProtocolIcon from './ProtocolIcon'

type Props = Omit<Position, 'assets' | 'positionType'> & {
  toggleExpanded: () => void
  isExpanded: boolean
  positionInUSD?: string
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
        {/* TODO: Open dapp url on click */}
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
