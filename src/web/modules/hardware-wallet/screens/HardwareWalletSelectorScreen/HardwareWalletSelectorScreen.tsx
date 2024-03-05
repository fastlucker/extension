import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import Stepper from '@web/modules/router/components/Stepper'

import HardwareWalletSelectorItem from '../../components/HardwareWalletSelectorItem'
import LedgerConnectModal from '../../components/LedgerConnectModal'
import getOptions from './options'

const HardwareWalletSelectorScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { updateStepperState } = useStepper()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const { dispatchAsync, dispatch } = useBackgroundService()
  const { theme } = useTheme()
  const [ledgerModalOpened, setLedgerModalOpened] = useState(false)

  useEffect(() => {
    updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
  }, [updateStepperState])

  useEffect(() => {
    if (accountAdderCtrlState.isInitialized) navigate(WEB_ROUTES.accountAdder)
  }, [accountAdderCtrlState.isInitialized, navigate])

  const onTrezorPress = useCallback(
    () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR' }),
    [dispatch]
  )

  const onLedgerPress = useCallback(async () => {
    setLedgerModalOpened(true)
  }, [setLedgerModalOpened])

  const onGridPlusPress = useCallback(async () => {
    try {
      await dispatchAsync({ type: 'LATTICE_CONTROLLER_UNLOCK' })
      navigate(WEB_ROUTES.accountAdder, {
        state: { keyType: 'lattice' }
      })
    } catch (error: any) {
      addToast(error.message, { type: 'error' })
    }
  }, [addToast, dispatchAsync, navigate])

  const options = useMemo(
    () => getOptions({ onGridPlusPress, onLedgerPress, onTrezorPress }),
    [onGridPlusPress, onLedgerPress, onTrezorPress]
  )

  return (
    <TabLayoutContainer
      width="lg"
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={<BackButton fallbackBackRoute={ROUTES.getStarted} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Select your Hardware Wallet device')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option, index) => (
              <HardwareWalletSelectorItem
                style={[flexbox.flex1, index === 1 ? spacings.mh : {}]}
                key={option.title}
                title={option.title}
                models={option.models}
                image={option.image}
                onPress={option.onPress}
              />
            ))}
          </View>
        </Panel>
        <LedgerConnectModal
          isOpen={ledgerModalOpened}
          onClose={() => setLedgerModalOpened(false)}
        />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default HardwareWalletSelectorScreen
