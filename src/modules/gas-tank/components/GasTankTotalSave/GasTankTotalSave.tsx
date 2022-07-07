import React from 'react'
import { View } from 'react-native'

import WalletIcon from '@assets/svg/WalletIcon'
import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

interface Props {
  totalSave: string
}

const GasTankTotalSave = ({ totalSave }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={[flexboxStyles.alignCenter, flexboxStyles.flex1, spacings.phMi]}>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <WalletIcon width={21} height={21} color={colors.turquoise} />
        <Text fontSize={10} style={[textStyles.uppercase, spacings.plMi]}>
          {t('Total Save')}
        </Text>
      </View>
      <Text fontSize={32} weight="regular" numberOfLines={1}>
        <Text fontSize={20} weight="regular" style={textStyles.highlightPrimary}>
          ${' '}
        </Text>
        {totalSave}
      </Text>
    </View>
  )
}

export default React.memo(GasTankTotalSave)
