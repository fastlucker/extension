import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import getStyles from '@common/modules/dashboard/components/DeFiPositions/DeFiPosition/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

type Props = {
  label: string
}

const DeFiPositionAssetsHeader: FC<Props> = ({ label }) => {
  const { t } = useTranslation()
  const { theme } = useTheme(getStyles)

  return (
    <View
      style={[
        flexbox.directionRow,
        spacings.phSm,
        spacings.pvMi,
        flexbox.flex1,
        flexbox.alignCenter,
        {
          backgroundColor: theme.quaternaryBackground
        }
      ]}
    >
      <Text
        style={[flexbox.flex1, text.uppercase]}
        fontSize={12}
        appearance="tertiaryText"
        weight="medium"
      >
        {label}
      </Text>
      <Text style={flexbox.flex1} fontSize={12} appearance="tertiaryText" weight="medium">
        {t('AMOUNT')}
      </Text>

      <Text
        style={{
          flex: 0.5
        }}
        fontSize={12}
        appearance="tertiaryText"
        weight="medium"
      >
        {t('APY')}
      </Text>
      <Text
        style={[
          {
            flex: 0.5
          },
          text.right
        ]}
        fontSize={12}
        appearance="tertiaryText"
        weight="medium"
      >
        {t('USD VALUE')}
      </Text>
    </View>
  )
}

export default DeFiPositionAssetsHeader
