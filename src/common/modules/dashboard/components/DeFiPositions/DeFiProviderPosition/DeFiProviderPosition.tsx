import React, { FC, useCallback, useState } from 'react'
import { View } from 'react-native'

import { PositionsByProvider } from '@ambire-common/libs/defiPositions/types'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import useTheme from '@common/hooks/useTheme'

import DeFiPosition from './DeFiPosition'
import DeFiPositionHeader from './DeFiPositionHeader'
import getStyles from './styles'

const DeFiProviderPosition: FC<PositionsByProvider> = ({
  providerName,
  positionInUSD,
  type,
  networkId,
  positions
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { styles, theme } = useTheme(getStyles)

  const positionInUSDFormatted = formatDecimals(positionInUSD, 'value')

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <View
      style={[
        styles.container,
        !!isExpanded && styles.expandedContainer,
        {
          backgroundColor: isExpanded ? theme.secondaryBackground : theme.primaryBackground
        }
      ]}
    >
      <DeFiPositionHeader
        providerName={providerName}
        networkId={networkId}
        toggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        positionInUSD={positionInUSDFormatted}
        healthRate={positions.length === 1 ? positions[0].additionalData.healthRate : undefined}
      />
      {isExpanded &&
        positions.map(({ id, assets, additionalData }, index) => (
          <DeFiPosition
            key={id}
            withTopBorder={index !== 0 && positions.length > 1}
            id={id}
            type={type}
            assets={assets}
            providerName={providerName}
            networkId={networkId}
            additionalData={additionalData}
            positionInUSD={formatDecimals(additionalData.positionInUSD || 0, 'value')}
          />
        ))}
    </View>
  )
}

export default React.memo(DeFiProviderPosition)
