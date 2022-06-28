import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
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
      <Text fontSize={10}>{t('TOTAL SAVE')}</Text>
      <Text fontSize={32} weight="regular" numberOfLines={1}>
        <Text fontSize={20} weight="regular" style={textStyles.highlightSecondary}>
          ${' '}
        </Text>
        {totalSave}
      </Text>
    </View>
  )
}

export default React.memo(GasTankTotalSave)
