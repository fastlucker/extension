import React from 'react'
import { useTranslation } from 'react-i18next'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Title from '@modules/common/components/Title'
import useTheme from '@modules/common/hooks/useTheme'
import { THEME_TYPES } from '@modules/common/styles/themeConfig'

const Theme = () => {
  const { t } = useTranslation()
  const { setThemeType, themeType } = useTheme()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()

  const handleOnThemeChange = (type: THEME_TYPES) => {
    setThemeType(type)
    closeBottomSheet()
  }

  return (
    <>
      <Button onPress={openBottomSheet} text={t('App theme: {{themeType}}', { themeType })} />
      <BottomSheet
        id="change-theme"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
      >
        <Title>{t('Change app theme')}</Title>

        {Object.values(THEME_TYPES).map((type) => (
          <Button key={type} text={type} onPress={() => handleOnThemeChange(type)} />
        ))}
      </BottomSheet>
    </>
  )
}

export default Theme
