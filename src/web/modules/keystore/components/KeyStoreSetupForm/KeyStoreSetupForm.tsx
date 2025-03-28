import React, { useCallback, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isValidPassword } from '@ambire-common/services/validations'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings, { SPACING_3XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import storage from '@web/extension-services/background/webapi/storage'
import KeyStoreLogo from '@web/modules/keystore/components/KeyStoreLogo'
import useKeyStoreSetup from '@web/modules/keystore/components/KeyStoreSetupForm/hooks/useKeyStoreSetup'
import { TERMS_VERSION } from '@web/modules/terms/components/TermsComponent'

type Props = {
  onContinue: () => void
  children?: React.ReactNode
}

const KeyStoreSetupForm = ({
  onContinue,

  children
}: Props) => {
  const { t } = useTranslation()
  const { ref: devicePasswordSetModalRef, open: openDevicePasswordSetModal } = useModalize()
  const {
    control,
    handleKeystoreSetup,
    password,
    isKeystoreSetupLoading,
    isKeystoreReady,
    formState
  } = useKeyStoreSetup()

  useEffect(() => {
    if (isKeystoreReady) {
      openDevicePasswordSetModal()
    }
  }, [isKeystoreReady, openDevicePasswordSetModal])

  const handleCreateButtonPress = useCallback(async () => {
    await storage.set('termsState', { version: TERMS_VERSION, acceptedAt: Date.now() })
    await handleKeystoreSetup()
  }, [handleKeystoreSetup])

  return (
    <>
      <View>
        <Controller
          control={control}
          rules={{ validate: isValidPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              testID="enter-pass-field"
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
              onSubmitEditing={handleCreateButtonPress}
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
              testID="repeat-pass-field"
              onBlur={onBlur}
              placeholder={t('Repeat Password')}
              onChangeText={onChange}
              value={value}
              isValid={!!value && !formState.errors.password && password === value}
              validLabel={t('✅ Passwords match')}
              secureTextEntry
              error={formState.errors.confirmPassword && (t("Passwords don't match.") as string)}
              autoCorrect={false}
              onSubmitEditing={handleKeystoreSetup}
            />
          )}
          name="confirmPassword"
        />
        {children}
        <Button
          testID="create-keystore-pass-btn"
          textStyle={{ fontSize: 14 }}
          size="large"
          disabled={formState.isSubmitting || isKeystoreSetupLoading || !formState.isValid}
          text={formState.isSubmitting || isKeystoreSetupLoading ? t('Loading...') : t('Confirm')}
          onPress={handleKeystoreSetup}
        />
      </View>
      <BottomSheet
        backgroundColor="primaryBackground"
        id="keystore-device-password-set-modal"
        sheetRef={devicePasswordSetModalRef}
        autoWidth
        style={{ paddingHorizontal: SPACING_3XL * 2, ...spacings.pv4Xl }}
      >
        <Text weight="medium" fontSize={20} style={[text.center, spacings.mbXl]}>
          {t('Device Password')}
        </Text>
        <KeyStoreLogo width={112} height={112} style={[flexbox.alignSelfCenter, spacings.mbXl]} />
        <Text fontSize={16} style={[spacings.mb2Xl, text.center]}>
          {t('Your Device Password is set!')}
        </Text>
        <Button
          testID="keystore-button-continue"
          text={t('Continue')}
          hasBottomSpacing={false}
          style={{ minWidth: 232 }}
          onPress={onContinue}
        >
          <View style={spacings.pl}>
            <RightArrowIcon color={colors.titan} />
          </View>
        </Button>
      </BottomSheet>
    </>
  )
}

export default React.memo(KeyStoreSetupForm)
