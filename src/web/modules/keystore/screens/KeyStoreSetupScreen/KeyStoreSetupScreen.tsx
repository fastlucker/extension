import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import KeyStoreSettingsIcon from '@common/assets/svg/KeyStoreSettingsIcon'
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
import spacings, { SPACING_3XL } from '@common/styles/spacings'
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
    if (state.latestMethodCall === 'addSecret' && state.status === 'SUCCESS') {
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
            text={isSubmitting || isKeystoreSetupLoading ? t('Creating...') : t('Create')}
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
        <Panel title={t('Create a Device Password')}>
          <View style={{ flex: 1, maxWidth: 330 }}>
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
                    errors.password &&
                    (t('Your password must be unique and at least 8 characters long.') as string)
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
                  placeholder={t('Repeat Password')}
                  onChangeText={onChange}
                  value={value}
                  isValid={!!value && watch('password', '') === value}
                  validLabel={t('✅ Passwords match, you are ready to continue')}
                  secureTextEntry
                  error={errors.confirmPassword && (t("Passwords don't match.") as string)}
                  autoCorrect={false}
                  containerStyle={spacings.mb0}
                  onSubmitEditing={handleKeystoreSetup}
                />
              )}
              name="confirmPassword"
            />
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem icon={KeyStoreSettingsIcon} title="Device Password">
          <TabLayoutWrapperSideContentItem.Text>
            Device Password protects your Ambire Wallet with a secret string of characters,
            encrypting all the keys stored locally with the Device Password through secure AES
            encryption.
          </TabLayoutWrapperSideContentItem.Text>
          <TabLayoutWrapperSideContentItem.Text>
            The first step is to select the password. It should be long, contain different types of
            characters and you should not reuse older passwords, and must not use it anywhere else.
          </TabLayoutWrapperSideContentItem.Text>
          <TabLayoutWrapperSideContentItem.Text>
            You will use the Device password to unlock the Ambire Wallet extension and sign
            transactions on the authorized device.
          </TabLayoutWrapperSideContentItem.Text>
          <TabLayoutWrapperSideContentItem.Text noMb>
            This password can be reset only if you have enabled recovery by your Email vault.
          </TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
      <Modal
        isOpen={keystoreReady}
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
            if (params?.flow === 'seed') {
              navigate(WEB_ROUTES.importSeedPhrase, {
                state: { backTo: WEB_ROUTES.importHotWallet }
              })
              return
            }
            if (params?.flow === 'private-key') {
              navigate(WEB_ROUTES.importPrivateKey, {
                state: { backTo: WEB_ROUTES.importHotWallet }
              })
              return
            }
            if (params?.flow === 'create-seed') {
              navigate(WEB_ROUTES.createSeedPhrasePrepare, {
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
