import React, { FC, useState } from 'react'
import { View } from 'react-native'

import { Position } from '@ambire-common/libs/defiPositions/types'
import useTheme from '@common/hooks/useTheme'
import formatDecimals from '@common/utils/formatDecimals'

import DeFiPositionExpanded from './DeFiPositionExpanded'
import DeFiPositionHeader from './DeFiPositionHeader'
import getStyles from './styles'

const DeFiPosition: FC<Position> = ({
  providerName,
  positionType,
  assets,
  networkId,
  additionalData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { styles, theme } = useTheme(getStyles)

  const positionInUSDFormatted = formatDecimals(additionalData?.positionInUSD, 'value')

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <View
      style={[
        styles.container,
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
        additionalData={additionalData}
        positionInUSD={positionInUSDFormatted}
      />
      {isExpanded && (
        <DeFiPositionExpanded
          positionType={positionType}
          assets={assets}
          providerName={providerName}
          networkId={networkId}
          additionalData={additionalData}
          positionInUsd={positionInUSDFormatted}
        />
      )}
    </View>
  )
}

export default DeFiPosition
