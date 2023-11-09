import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Modal from '@common/components/Modal'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import { DEVICE_SECURITY_LEVEL } from '@common/contexts/biometricsContext/constants'
import useBiometrics from '@common/hooks/useBiometrics'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import storage from '@web/extension-services/background/webapi/storage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Stepper from '@web/modules/router/components/Stepper'

import KeyStoreLogo from '../../components/KeyStoreLogo'

const KeyStoreSetupScreen = () => {
  const { t } = useTranslation()
  const { navigate, goBack } = useNavigation()
  const { params } = useRoute()
  const { updateStepperState } = useStepper()
  const [keystoreReady, setKeystoreReady] = useState(false)
  const state = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { theme } = useTheme()

  useEffect(() => {
    if (!params?.flow) return
    updateStepperState(WEB_ROUTES.keyStoreSetup, params.flow)
  }, [updateStepperState, params?.flow])

  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
      optInForBiometricsUnlock:
        !isWeb && hasBiometricsHardware && deviceSecurityLevel === DEVICE_SECURITY_LEVEL.BIOMETRIC
    }
  })

  useEffect(() => {
    if (!params?.flow) {
      navigate(WEB_ROUTES.getStarted)
    }
  }, [params?.flow, navigate])

  useEffect(() => {
    if (state.latestMethodCall === 'addSecret' && state.status === 'DONE') {
      setKeystoreReady(true)
    }
  }, [state.latestMethodCall, state.status])

  useEffect(() => {
    ;(async () => {
      const secrets = await storage.get('keystoreSecrets', [])
      if (secrets.some((s: any) => s.id === 'password')) {
        goBack()
      }
    })()
  }, [goBack])

  const handleKeystoreSetup = () => {
    handleSubmit(({ password }) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_ADD_SECRET',
        params: { secretId: 'password', secret: password, extraEntropy: '', leaveUnlocked: true }
      })
    })()
  }

  const isKeystoreSetupLoading =
    state.status !== 'INITIAL' && state.latestMethodCall === 'addSecret'

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper containerStyle={{ maxWidth: tabLayoutWidths.lg }} />
        </Header>
      }
      footer={
        <>
          <BackButton />
          <Button
            textStyle={{ fontSize: 14 }}
            hasBottomSpacing={false}
            disabled={isSubmitting || isKeystoreSetupLoading || !isValid}
            text={
              isSubmitting || isKeystoreSetupLoading
                ? t('Setting Up Your Key Store...')
                : t('Setup Ambire Key Store')
            }
            onPress={handleKeystoreSetup}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Ambire Key Store')}>
          <View style={[flexbox.directionRow]}>
            <View style={{ flex: 1, maxWidth: 330 }}>
              <Controller
                control={control}
                rules={{ validate: isValidPassword }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    onBlur={onBlur}
                    placeholder={t('Enter Passphrase')}
                    onChangeText={onChange}
                    isValid={isValidPassword(value)}
                    autoFocus={isWeb}
                    value={value}
                    error={
                      errors.password &&
                      (t('Please fill in at least 8 characters for passphrase.') as string)
                    }
                    containerStyle={[spacings.mbTy, { maxWidth: 330 }]}
                    onSubmitEditing={handleKeystoreSetup}
                  />
                )}
                name="password"
              />
              <Controller
                control={control}
                rules={{
                  validate: (value) => watch('password', '') === value
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onBlur={onBlur}
                    placeholder={t('Repeat Passphrase')}
                    onChangeText={onChange}
                    value={value}
                    isValid={!!value && watch('password', '') === value}
                    validLabel={t('✅ Passwords match, you are ready to continue')}
                    secureTextEntry
                    error={errors.confirmPassword && (t("Passphrases don't match.") as string)}
                    autoCorrect={false}
                    containerStyle={spacings.mb0}
                    onSubmitEditing={handleKeystoreSetup}
                  />
                )}
                name="confirmPassword"
              />
            </View>
            <View style={spacings.plMd}>
              <KeyStoreLogo width={117} height={117} />
            </View>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem>
          <TabLayoutWrapperSideContentItem.Title>
            Setup Your Ambire Key Store
          </TabLayoutWrapperSideContentItem.Title>
          <TabLayoutWrapperSideContentItem.Text>
            Ambire Keystore will protect your Ambire Wallet with a passphrase, encrypting all the
            keys that are stored locally with this passphrase through secure AES encryption.
          </TabLayoutWrapperSideContentItem.Text>
          <TabLayoutWrapperSideContentItem.Group>
            <TabLayoutWrapperSideContentItem.Text>
              1. First, pick your passphrase. It should be long and you shouldn&apos;t reuse other
              passphrases.
            </TabLayoutWrapperSideContentItem.Text>
          </TabLayoutWrapperSideContentItem.Group>
          <TabLayoutWrapperSideContentItem.Group>
            <TabLayoutWrapperSideContentItem.Text>
              2. You will use your passphrase to unlock the Ambire extension and sign transactions
              on this device.
            </TabLayoutWrapperSideContentItem.Text>
          </TabLayoutWrapperSideContentItem.Group>
          <TabLayoutWrapperSideContentItem.Group noMb>
            <TabLayoutWrapperSideContentItem.Text noMb>
              3. This passphrase can only be reset if you enable recovery via your email vault.
            </TabLayoutWrapperSideContentItem.Text>
          </TabLayoutWrapperSideContentItem.Group>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
      <Modal isOpen={keystoreReady} modalStyle={{ minWidth: 'unset' }}>
        <Text weight="medium" fontSize={20} style={[text.center, spacings.mbXl]}>
          {t('Ambire Key Store')}
        </Text>
        <KeyStoreLogo style={[flexbox.alignSelfCenter, spacings.mbXl]} />
        <Text fontSize={16} style={[spacings.mbLg, text.center]}>
          {t('Your Ambire Key Store is\nready!')}
        </Text>
        <Button
          text={t('Continue')}
          hasBottomSpacing={false}
          style={{ minWidth: 232 }}
          onPress={() => {
            if (params?.flow === 'email') {
              navigate(WEB_ROUTES.createEmailVault, {
                state: { backTo: WEB_ROUTES.getStarted }
              })
              return
            }
            if (params?.flow === 'hw') {
              navigate(WEB_ROUTES.hardwareWalletSelect, {
                state: { backTo: WEB_ROUTES.getStarted }
              })
              return
            }
            if (params?.flow === 'legacy') {
              navigate(WEB_ROUTES.externalSigner, {
                state: { backTo: WEB_ROUTES.getStarted }
              })
            }
          }}
        >
          <View style={spacings.pl}>
            <RightArrowIcon color={colors.titan} />
          </View>
        </Button>
      </Modal>
    </TabLayoutContainer>
  )
}

export default KeyStoreSetupScreen
