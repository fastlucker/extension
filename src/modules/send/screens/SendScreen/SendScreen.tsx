import React, { useRef } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Placeholder from '@modules/common/components/Placeholder'
import Text from '@modules/common/components/Text'

import styles from './styles'

const SendScreen = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet } = useBottomSheet()

  return (
    <View style={styles.container}>
      <Button text={t('Address book')} onPress={openBottomSheet} />

      <BottomSheet sheetRef={sheetRef}>
        <Text>Coming soon.</Text>
      </BottomSheet>
    </View>
  )
}

export default SendScreen
