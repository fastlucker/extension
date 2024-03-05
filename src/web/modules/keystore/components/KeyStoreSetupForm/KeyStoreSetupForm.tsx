import React from 'react'
import { Controller, Control, FormState } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Modal from '@common/components/Modal'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings, { SPACING_3XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import KeyStoreLogo from '../KeyStoreLogo'

type FormFields = {
  password: string
  confirmPassword: string
}

type Props = {
  showSubmitButton?: boolean
  isKeystoreReady: boolean
  isKeystoreSetupLoading: boolean
  onContinue: () => void
  handleKeystoreSetup: () => void
  control: Control<FormFields>
  password: string
  formState: FormState<FormFields>
}

const KeyStoreSetupForm = ({
  showSubmitButton,
  onContinue,
  control,
  handleKeystoreSetup,
  password,
  isKeystoreSetupLoading,
  isKeystoreReady,
  formState
}: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <View>
        <Controller
          control={control}
          rules={{ validate: isValidPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              onBlur={onBlur}
              placeholder={t('Enter Password')}
              onChangeText={onChange}
              isValid={isValidPassword(value)}
              autoFocus={isWeb}
              value={value}
              error={
                formState.errors.password &&
                (t('Your password must be unique and at least 8 characters long.') as string)
              }
              containerStyle={spacings.mbTy}
              onSubmitEditing={handleKeystoreSetup}
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            validate: (value) => password === value
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              placeholder={t('Repeat Password')}
              onChangeText={onChange}
              value={value}
              isValid={!!value && password === value}
              validLabel={t('✅ Passwords match, you are ready to continue')}
              secureTextEntry
              error={formState.errors.confirmPassword && (t("Passwords don't match.") as string)}
              autoCorrect={false}
              containerStyle={!showSubmitButton ? spacings.mb3Xl : {}}
              onSubmitEditing={handleKeystoreSetup}
            />
          )}
          name="confirmPassword"
        />
        {showSubmitButton && (
          <Button
            textStyle={{ fontSize: 14 }}
            size="large"
            disabled={formState.isSubmitting || isKeystoreSetupLoading || !formState.isValid}
            text={formState.isSubmitting || isKeystoreSetupLoading ? t('Creating...') : t('Create')}
            onPress={handleKeystoreSetup}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        )}
        <Alert type="info">
          <Text fontSize={16} weight="semiBold" appearance="infoText">
            {t('Password requirements:')}
          </Text>
          <Text fontSize={16} appearance="infoText">
            {t('Your password must be unique and at least 8 characters long.')}
          </Text>
        </Alert>
      </View>
      <Modal
        isOpen={isKeystoreReady}
        modalStyle={{ minWidth: 'unset', paddingHorizontal: SPACING_3XL * 2, ...spacings.pv4Xl }}
      >
        <Text weight="medium" fontSize={20} style={[text.center, spacings.mbXl]}>
          {t('Device Password')}
        </Text>
        <KeyStoreLogo width={112} height={112} style={[flexbox.alignSelfCenter, spacings.mbXl]} />
        <Text fontSize={16} style={[spacings.mb2Xl, text.center]}>
          {t('Your Device Password is set!')}
        </Text>
        <Button
          text={t('Continue')}
          hasBottomSpacing={false}
          style={{ minWidth: 232 }}
          onPress={onContinue}
        >
          <View style={spacings.pl}>
            <RightArrowIcon color={colors.titan} />
          </View>
        </Button>
      </Modal>
    </>
  )
}

export default React.memo(KeyStoreSetupForm)
