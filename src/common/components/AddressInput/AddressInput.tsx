import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Input, { InputProps } from '@common/components/Input'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Button from '../Button'
import getStyles from './styles'

export interface AddressValidation {
  isError: boolean
  message: string
}

interface Props extends InputProps {
  ensAddress: string
  isRecipientDomainResolving: boolean
  validation: AddressValidation
  label?: string
}

const AddressInput: React.FC<Props> = ({
  onChangeText,
  ensAddress,
  isRecipientDomainResolving,
  label,
  validation,
  containerStyle = {},
  placeholder,
  childrenBeforeButtons,
  ...rest
}) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)

  const { message, isError } = validation
  const isValidationInDomainResolvingState = message === 'Resolving domain...'

  const isValid = useMemo(
    () => !isError && !isValidationInDomainResolvingState,
    [isError, isValidationInDomainResolvingState]
  )
  return (
    <>
      {label && (
        <Text fontSize={14} appearance="secondaryText" weight="regular" style={styles.label}>
          {label}
        </Text>
      )}
      <Input
        onChangeText={onChangeText}
        // Purposefully spread props here, so that we don't override AddressInput's props
        testID="address-ens-field"
        {...rest}
        containerStyle={containerStyle}
        validLabel={isValid ? message : ''}
        error={isError ? message : ''}
        isValid={isValid}
        editable={!isValid}
        placeholder={placeholder || t('Address / ENS')}
        bottomLabelStyle={styles.bottomLabel}
        info={isValidationInDomainResolvingState ? t('Resolving domain...') : ''}
        childrenBeforeButtons={
          childrenBeforeButtons ||
          (isValid ? (
            <View style={[flexbox.alignCenter, flexbox.directionRow]}>
              <Button
                size="tiny"
                hasBottomSpacing={false}
                text={t('Clear')}
                type="gray"
                style={{ ...spacings.phTy, height: 28 }}
                accentColor={theme.secondaryText}
                onPress={() => !!onChangeText && onChangeText('')}
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
