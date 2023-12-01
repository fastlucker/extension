import React, { useCallback, useMemo } from 'react'
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

interface Props extends InputProps {
  isValidUDomain?: boolean
  isValidEns?: boolean
  isRecipientDomainResolving?: boolean
  label?: string
}

const RecipientInput: React.FC<Props> = ({
  onChangeText,
  isValidUDomain,
  isValidEns,
  isRecipientDomainResolving,
  label,
  ...rest
}) => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const setValidationLabel = useMemo(() => {
    if (isRecipientDomainResolving) {
      return t('Resolving domain...')
    }
    if (isValidUDomain) {
      return t('Valid Unstoppable domainsⓇ domain')
    }
    if (isValidEns) {
      return t('Valid Ethereum Name ServicesⓇ domain')
    }
    return ''
  }, [isValidUDomain, isValidEns, t])

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
        validLabel={setValidationLabel}
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
