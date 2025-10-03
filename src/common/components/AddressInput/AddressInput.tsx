import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import AddressBookContact from '@common/components/AddressBookContact'
import Button from '@common/components/Button'
import Input, { InputProps } from '@common/components/Input'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'

import getStyles from './styles'

export interface AddressValidation {
  isError: boolean
  message: string
}

interface Props extends InputProps {
  withDetails?: boolean
  ensAddress: string
  isRecipientDomainResolving: boolean
  validation: AddressValidation
  label?: string
  onClearButtonPress?: () => void
  onOpenAddToAddressBook?: () => void
}

const AddressInput: React.FC<Props> = ({
  withDetails,
  onChangeText,
  ensAddress,
  isRecipientDomainResolving,
  label,
  validation,
  containerStyle = {},
  placeholder,
  childrenBeforeButtons,
  onClearButtonPress,
  onOpenAddToAddressBook,
  ...rest
}) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const [isFocused, setIsFocused] = useState(false)
  const { contacts } = useAddressBookControllerState()
  const { message, isError } = validation
  const isValidationInDomainResolvingState = message === 'Resolving domain...'
  const inputRef = useRef<TextInput | null>(null)

  const setInputRef = useCallback((ref: TextInput | null) => {
    if (ref) inputRef.current = ref
  }, [])

  const isValid = useMemo(
    () => !isError && !isValidationInDomainResolvingState,
    [isError, isValidationInDomainResolvingState]
  )

  const address = ensAddress || rest.value!

  return (
    <>
      {label && (
        <Text fontSize={14} appearance="secondaryText" weight="regular" style={styles.label}>
          {label}
        </Text>
      )}
      <Input
        setInputRef={setInputRef}
        onChangeText={onChangeText}
        // Purposefully spread props here, so that we don't override AddressInput's props
        testID="address-ens-field"
        {...rest}
        containerStyle={containerStyle}
        validLabel={isValid ? message : ''}
        error={isError ? message : ''}
        isValid={isValid}
        placeholder={placeholder || t('Address / ENS')}
        bottomLabelStyle={styles.bottomLabel}
        info={isValidationInDomainResolvingState ? t('Resolving domain...') : ''}
        childrenBeforeButtons={childrenBeforeButtons}
        onFocus={(e) => {
          if (isValid && withDetails) return
          setIsFocused(true)
          !!rest.onFocus && rest.onFocus(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          !!rest.onBlur && rest.onBlur(e)
        }}
        customInputContent={
          !!withDetails && isValid && !isFocused ? (
            <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
              <AddressBookContact
                avatarSize={36}
                key={address}
                style={{
                  borderRadius: 0,
                  ...spacings.ph0,
                  ...spacings.pv0
                }}
                address={address}
                name={contacts.find((c) => c.address === address)?.name}
                onAddToAddressBookPress={onOpenAddToAddressBook}
              />
            </View>
          ) : null
        }
        button={
          rest.button ||
          (rest.value && withDetails ? (
            <View style={[flexbox.alignCenter, flexbox.directionRow]}>
              <Button
                size="tiny"
                hasBottomSpacing={false}
                text={t('Clear')}
                type="gray"
                style={{ ...spacings.phTy, height: 28 }}
                accentColor={theme.secondaryText}
                onPress={() => {
                  !!onChangeText && onChangeText('')
                  inputRef?.current?.focus()
                  !!onClearButtonPress && onClearButtonPress()
                }}
              >
                <CloseIcon width={12} height={12} strokeWidth="1.75" style={spacings.mlMi} />
              </Button>
            </View>
          ) : null)
        }
      />
    </>
  )
}

export default React.memo(AddressInput)
