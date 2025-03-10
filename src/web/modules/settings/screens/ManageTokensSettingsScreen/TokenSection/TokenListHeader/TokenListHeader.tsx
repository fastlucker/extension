import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const TokenListHeader = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pvMi]}>
      <View style={{ flex: 1.25, ...spacings.plSm }}>
        <Text appearance="secondaryText" fontSize={14}>
          {t('Token')}
        </Text>
      </View>
      <View style={{ flex: 1.5 }}>
        <Text appearance="secondaryText" fontSize={14}>
          {t('Network')}
        </Text>
      </View>
      <View
        style={{ flex: 0.4, ...flexbox.directionRow, ...flexbox.alignCenter, ...spacings.prSm }}
      >
        <Text appearance="secondaryText" fontSize={14}>
          {t('Manage')}
        </Text>
        {/* <InfoIcon
          color={theme.secondaryText}
          width={14}
          height={14}
          data-tooltip-id="visibility-info"
          style={spacings.mlMi}
        />
        <Tooltip
          id="visibility-info"
          content={t(
            'Control which tokens appear in your portfolio. Hidden tokens will not be shown and will be excluded from your total balance.'
          )}
        /> */}
      </View>
    </View>
  )
}

export default TokenListHeader
