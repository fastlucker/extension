import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Input, { InputProps } from '@modules/common/components/Input'
import Title from '@modules/common/components/Title'
import { DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '@modules/common/styles/spacings'

import BottomSheet from '../BottomSheet'
import useBottomSheet from '../BottomSheet/hooks/useBottomSheet'
import QRCodeScanner from '../QRCodeScanner'

interface Props extends InputProps {}

const InputOrScan: React.FC<Props> = ({ onChangeText, ...rest }) => {
  const { t } = useTranslation()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()

  const handleOnScan = useCallback(
    (code: string) => {
      if (onChangeText) onChangeText(code)

      closeBottomSheet()
    },
    [onChangeText, closeBottomSheet]
  )

  // Wraps the container in order to fit the whole horizontal space available
  const qrCodeScannerContainerStyle = {
    width: DEVICE_WIDTH - SPACING * 2,
    height: DEVICE_HEIGHT / 2
  }

  return (
    <>
      <Input
        buttonText={t('Scan')}
        onButtonPress={openBottomSheet}
        onChangeText={onChangeText}
        {...rest}
      />
      <BottomSheet
        id="add-token"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <Title>{t('Scan recipient QR code')}</Title>
        <View style={qrCodeScannerContainerStyle}>
          <QRCodeScanner onScan={handleOnScan} />
        </View>
      </BottomSheet>
    </>
  )
}

export default InputOrScan
