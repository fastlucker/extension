import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const Header = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.justifySpaceBetween,
        flexbox.alignCenter,
        spacings.mbXl
      ]}
    >
      <View style={{ maxWidth: 512 }}>
        <Text appearance="primaryText" fontSize={20} style={spacings.mbMi} weight="medium">
          {t('Manage Tokens')}
        </Text>
        <Text appearance="secondaryText">
          {t(
            'Manage your custom and hidden tokens. These settings will be applied across all accounts.'
          )}
        </Text>
      </View>
      <Button
        childrenPosition="left"
        style={{ width: 220 }}
        text={t('Add Custom Token')}
        onPress={() => {}}
      >
        <AddIcon color={theme.primaryBackground} />
      </Button>
    </View>
  )
}

export default Header
