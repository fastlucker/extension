import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import EnsIcon from '@assets/svg/EnsIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import UnstoppableDomainIcon from '@assets/svg/UnstoppableDomainIcon'
import { isWeb } from '@config/env'
import Input, { InputProps } from '@modules/common/components/Input'
import Title from '@modules/common/components/Title'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import BottomSheet from '../BottomSheet'
import QRCodeScanner from '../QRCodeScanner'

interface Props extends InputProps {
  isValidUDomain?: boolean
  isValidEns?: boolean
}

const RecipientInput: React.FC<Props> = ({ onChangeText, isValidUDomain, isValidEns, ...rest }) => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

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

  return (
    <>
      <Input
        button={
          <View style={flexboxStyles.directionRow}>
            <UnstoppableDomainIcon isActive={isValidUDomain} />
            <View style={spacings.plTy}>
              <EnsIcon isActive={isValidEns} />
            </View>
            {!isWeb && (
              <TouchableOpacity style={spacings.plTy} onPress={handleOnButtonPress}>
                <ScanIcon isFilled={false} />
              </TouchableOpacity>
            )}
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
      {!isWeb && (
        <BottomSheet id="add-token" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
          <Title style={textStyles.center}>{t('Scan recipient QR code')}</Title>
          <QRCodeScanner onScan={handleOnScan} />
        </BottomSheet>
      )}
    </>
  )
}

export default React.memo(RecipientInput)
