import React from 'react'
import { Pressable, View } from 'react-native'

import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'

import getStyles from './styles'

const MaxAmount = ({
  maxAmount,
  maxAmountInFiat,
  selectedTokenSymbol,
  isLoading,
  onMaxButtonPress
}: {
  maxAmount: number | null
  maxAmountInFiat: number | null
  selectedTokenSymbol: string
  isLoading: boolean
  onMaxButtonPress: () => void
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  if (maxAmount === null) return null

  return selectedTokenSymbol && !isLoading ? (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Text
        testID="max-available-amount"
        numberOfLines={1}
        fontSize={12}
        appearance="secondaryText"
        ellipsizeMode="tail"
      >
        {t('Balance: ')}
        {`${maxAmount === 0 ? 0 : formatDecimals(maxAmount, 'amount')} ${selectedTokenSymbol} /`}
        {` ${maxAmountInFiat ? formatDecimals(maxAmountInFiat, 'value') : 0} USD`}
      </Text>
      <Pressable style={styles.maxButton} onPress={onMaxButtonPress}>
        <Text fontSize={12} weight="medium" appearance="primary">
          {t('Max')}
        </Text>
      </Pressable>
    </View>
  ) : (
    <SkeletonLoader height={22} width={100} />
  )
}

export default React.memo(MaxAmount)
