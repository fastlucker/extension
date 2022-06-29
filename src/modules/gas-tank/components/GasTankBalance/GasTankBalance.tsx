import React from 'react'
import { View } from 'react-native'

import GasTankIcon from '@assets/svg/GasTankIcon'
import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

interface Props {
  balance: string
}

const GasTankBalance = ({ balance }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <GasTankIcon width={21} height={21} viewBoxWidth={20} />
        <Text fontSize={10} style={[textStyles.uppercase, spacings.plMi]}>
          {t('Gas Tank Balance')}
        </Text>
      </View>
      <Text fontSize={32} weight="regular" numberOfLines={1}>
        <Text fontSize={20} weight="regular" style={textStyles.highlightSecondary}>
          ${' '}
        </Text>
        {balance}
      </Text>
    </View>
  )
}

export default React.memo(GasTankBalance)
