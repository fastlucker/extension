import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import storage from '@web/extension-services/background/webapi/storage'
import KeyStoreSetupForm from '@web/modules/keystore/components/KeyStoreSetupForm'
import useKeyStoreSetup from '@web/modules/keystore/components/KeyStoreSetupForm/hooks/useKeyStoreSetup'
import Stepper from '@web/modules/router/components/Stepper'

const KeyStoreSetupScreen = () => {
  const { t } = useTranslation()
  const { navigate, goBack } = useNavigation()
  const { params, search } = useRoute()
  const { updateStepperState } = useStepper()
  const { theme } = useTheme()
  const keyStoreSetup = useKeyStoreSetup()

  const flow = useMemo(() => {
    if (params?.flow) return params.flow

    const searchParams = new URLSearchParams(search)

    return searchParams.get('flow') || null
  }, [params?.flow, search])

  useEffect(() => {
    if (!flow) return
    updateStepperState(WEB_ROUTES.keyStoreSetup, flow)
  }, [updateStepperState, flow])

  useEffect(() => {
    if (!flow) {
      navigate(WEB_ROUTES.getStarted)
    }
  }, [flow, navigate])

  useEffect(() => {
    ;(async () => {
      const secrets = await storage.get('keystoreSecrets', [])
      if (secrets.some((s: any) => s.id === 'password')) {
        goBack()
      }
    })()
  }, [goBack])

  const onKeyStoreCreation = useCallback(() => {
    if (flow === 'hw') {
      navigate(WEB_ROUTES.hardwareWalletSelect, {
        state: { backTo: WEB_ROUTES.getStarted }
      })
      return
    }
    if (flow === 'seed') {
      navigate(WEB_ROUTES.importSeedPhrase, {
        state: { backTo: WEB_ROUTES.importHotWallet }
      })
      return
    }
    if (flow === 'create-seed') {
      navigate(WEB_ROUTES.createSeedPhrasePrepare, {
        state: { backTo: WEB_ROUTES.importHotWallet }
      })
      return
    }
    if (flow === 'private-key') {
      navigate(WEB_ROUTES.importPrivateKey, {
        state: { backTo: WEB_ROUTES.importHotWallet }
      })
      return
    }
    if (flow === 'create-seed') {
      navigate(WEB_ROUTES.createSeedPhrasePrepare, {
        state: { backTo: WEB_ROUTES.getStarted }
      })
    }
    if (flow === 'import-json') {
      navigate(WEB_ROUTES.importSmartAccountJson, {
        state: { backTo: WEB_ROUTES.importHotWallet }
      })
    }
    if (flow === 'seed-with-option-to-save') {
      navigate(WEB_ROUTES.importSeedPhrase, {
        state: { backTo: WEB_ROUTES.importHotWallet }
      })
    }
  }, [flow, navigate])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="xs"
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper containerStyle={{ maxWidth: tabLayoutWidths.lg }} />
        </Header>
      }
      footer={
        <>
          <BackButton />
          <Button
            testID="keystore-button-create"
            textStyle={{ fontSize: 14 }}
            size="large"
            hasBottomSpacing={false}
            disabled={
              keyStoreSetup.formState.isSubmitting ||
              keyStoreSetup.isKeystoreSetupLoading ||
              !keyStoreSetup.formState.isValid ||
              keyStoreSetup.hasPasswordSecret
            }
            text={
              keyStoreSetup.formState.isSubmitting || keyStoreSetup.isKeystoreSetupLoading
                ? t('Creating...')
                : t('Create')
            }
            onPress={keyStoreSetup.handleKeystoreSetup}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Create a Device Password')} forceContainerSmallSpacings>
          <KeyStoreSetupForm onContinue={onKeyStoreCreation} {...keyStoreSetup} />
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default KeyStoreSetupScreen
