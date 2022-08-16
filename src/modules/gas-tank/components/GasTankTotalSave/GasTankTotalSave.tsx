import { NetworkId } from 'ambire-common/src/constants/networks'
import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  totalSave: string
  totalCashBack: string
  networkId?: NetworkId
}

const GasTankTotalSave = ({ totalSave, totalCashBack, networkId }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={flexboxStyles.flex1}>
      <View style={[spacings.plSm, flexboxStyles.flex1, flexboxStyles.justifyCenter]}>
        <View style={[flexboxStyles.directionRow, spacings.mbTy, flexboxStyles.alignCenter]}>
          <Text fontSize={10} color={colors.turquoise} style={flexboxStyles.flex1}>
            {t('Total Saved')}:
          </Text>
          <Text fontSize={10} weight="regular" numberOfLines={1}>
            <Text fontSize={10} weight="regular" color={colors.turquoise}>
              ${' '}
            </Text>
            {totalSave}
          </Text>
        </View>
        <View style={[flexboxStyles.directionRow, spacings.mbTy, flexboxStyles.alignCenter]}>
          <Text fontSize={10} color={colors.heliotrope} style={flexboxStyles.flex1}>
            {t('Cashback')}:
          </Text>
          <Text fontSize={10} weight="regular" numberOfLines={1}>
            <Text fontSize={10} weight="regular" color={colors.heliotrope}>
              ${' '}
            </Text>
            {totalCashBack}
          </Text>
        </View>
        {!!networkId && (
          <Text color={colors.chetwode} fontSize={10}>
            From gas fees on {networkId?.toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  )
}

export default React.memo(GasTankTotalSave)
