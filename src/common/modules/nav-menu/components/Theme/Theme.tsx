import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import textStyles from '@common/styles/utils/text'

const Theme = () => {
  const { t } = useTranslation()
  const { setThemeType, themeType } = useTheme()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const handleOnThemeChange = (type: THEME_TYPES) => {
    setThemeType(type)
    closeBottomSheet()
  }

  const themeNames = {
    [THEME_TYPES.AUTO]: t('Auto (coming soon)'),
    [THEME_TYPES.DARK]: t('Dark Mode'),
    [THEME_TYPES.LIGHT]: t('Light Mode (coming soon)')
  }

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet} style={spacings.mbSm}>
        <Text color={colors.titan_50}>
          {t('Theme: {{themeName}}', { themeName: themeNames[themeType] })}
        </Text>
      </TouchableOpacity>
      <BottomSheet id="change-theme" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <Title style={textStyles.center}>{t('Change app theme')}</Title>

        {Object.values(THEME_TYPES).map((type) => (
          <Button
            key={type}
            text={themeNames[type]}
            // disabled={type !== THEME_TYPES.DARK}
            onPress={() => handleOnThemeChange(type)}
          />
        ))}
      </BottomSheet>
    </>
  )
}

export default Theme
