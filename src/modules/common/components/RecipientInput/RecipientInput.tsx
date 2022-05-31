import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, View } from 'react-native'

import ScanIcon from '@assets/svg/ScanIcon'
import UnstoppableDomainIcon from '@assets/svg/UnstoppableDomainIcon'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import Input, { InputProps } from '@modules/common/components/Input'
import Title from '@modules/common/components/Title'
import colors from '@modules/common/styles/colors'
import spacings, { DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import BottomSheet from '../BottomSheet'
import useBottomSheet from '../BottomSheet/hooks/useBottomSheet'
import QRCodeScanner from '../QRCodeScanner'

interface Props extends InputProps {
  isValidUDomain?: boolean
}

const RecipientInput: React.FC<Props> = ({ onChangeText, isValidUDomain, ...rest }) => {
  const { t } = useTranslation()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()

  const handleOnScan = useCallback(
    (code: string) => {
      if (onChangeText) onChangeText(code)

      closeBottomSheet()
    },
    [onChangeText, closeBottomSheet]
  )

  const handleOnButtonPress = useCallback(() => {
    Keyboard.dismiss()
    openBottomSheet()
  }, [openBottomSheet])

  // Wraps the container in order to fit the whole horizontal space available
  const qrCodeScannerContainerStyle = {
    width: DEVICE_WIDTH - SPACING * 2,
    height: DEVICE_HEIGHT / 2
  }

  return (
    <>
      <Input
        button={
          <View style={flexboxStyles.directionRow}>
            <UnstoppableDomainIcon isActive={isValidUDomain} />
            <TouchableOpacity style={spacings.plTy} onPress={handleOnButtonPress}>
              <ScanIcon isFilled={false} />
            </TouchableOpacity>
          </View>
        }
        buttonProps={{
          activeOpacity: 1,
          disabled: true
        }}
        onButtonPress={() => null}
        onChangeText={onChangeText}
        {...rest}
      />
      <BottomSheet
        id="add-token"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
      >
        <Title>{t('Scan recipient QR code')}</Title>
        <View style={qrCodeScannerContainerStyle}>
          <QRCodeScanner onScan={handleOnScan} />
        </View>
      </BottomSheet>
    </>
  )
}

export default React.memo(RecipientInput)
