import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import EnsIcon from '@common/assets/svg/EnsIcon'
import ScanIcon from '@common/assets/svg/ScanIcon'
import UnstoppableDomainIcon from '@common/assets/svg/UnstoppableDomainIcon'
import Input, { InputProps } from '@common/components/Input'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { isWeb } from '@common/config/env'
import textStyles from '@common/styles/utils/text'

import BottomSheet from '../BottomSheet'
import QRCodeScanner from '../QRCodeScanner'
import styles from './styles'

export interface AddressValidation {
  isError: boolean
  message: string
}

interface Props extends InputProps {
  isValidUDomain?: boolean
  isValidEns?: boolean
  isRecipientDomainResolving?: boolean
  label?: string
  validation: AddressValidation
}

const AddressInput: React.FC<Props> = ({
  onChangeText,
  isValidUDomain,
  isValidEns,
  isRecipientDomainResolving,
  label,
  validation,
  ...rest
}) => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const { message, isError } = validation

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
      {label && (
        <Text fontSize={14} appearance="secondaryText" weight="regular" style={styles.label}>
          {label}
        </Text>
      )}
      <Input
        button={
          <View style={styles.domainIcons}>
            <UnstoppableDomainIcon isActive={isValidUDomain} />
            <View style={styles.plTy}>
              <EnsIcon isActive={isValidEns} />
            </View>
            {!isWeb && (
              <TouchableOpacity style={styles.plTy} onPress={handleOnButtonPress}>
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
        validLabel={!isError ? message : ''}
        error={isError ? message : ''}
        isValid={!isError}
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

export default React.memo(AddressInput)
