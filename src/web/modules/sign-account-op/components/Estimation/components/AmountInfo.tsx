import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'

const AmountInfo = ({
  label,
  amountFormatted,
  amountUsd,
  symbol
}: {
  label: string
  amountFormatted: string
  amountUsd: string
  symbol: string | undefined
}) => {
  const { t } = useTranslation()

  return (
    <View>
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
        <View style={[flexbox.directionRow]}>
          <Text fontSize={16} weight="medium">
            {t(label)}:{' '}
          </Text>
          <Text selectable fontSize={16} weight="medium">
            {formatDecimals(parseFloat(amountFormatted))} {symbol}
          </Text>
        </View>
        <View>
          {amountUsd ? (
            <Text selectable weight="medium" fontSize={16} appearance="primary">
              {' '}
              (~ ${formatDecimals(Number(amountUsd))})
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default AmountInfo
