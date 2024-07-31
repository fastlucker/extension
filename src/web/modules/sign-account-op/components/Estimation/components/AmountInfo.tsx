import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'

const AmountInfo = ({
  label,
  amountFormatted,
  symbol
}: {
  label: string
  amountFormatted: string
  symbol: string | undefined
}) => {
  const { t } = useTranslation()

  return (
    <View>
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
        <Text fontSize={16} weight="medium">
          {t(label)}:{' '}
        </Text>
        <Text selectable fontSize={16} weight="medium">
          {formatDecimals(parseFloat(amountFormatted))} {symbol}
        </Text>
      </View>
    </View>
  )
}

export default AmountInfo
