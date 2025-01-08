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
import { isSafari } from '@web/constants/browserapi'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import Stepper from '@web/modules/router/components/Stepper'

import HardwareWalletSelectorItem from '../../components/HardwareWalletSelectorItem'
import LedgerConnectModal from '../../components/LedgerConnectModal'
import getOptions from './options'

const HardwareWalletSelectorScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const mainCtrlState = useMainControllerState()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const { dispatch } = useBackgroundService()
  const { theme } = useTheme()
  const [isLedgerConnectModalVisible, setIsLedgerConnectModalVisible] = useState(false)
  const { addToast } = useToast()
  useEffect(() => {
    updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
  }, [updateStepperState])

  useEffect(() => {
    if (
      accountAdderCtrlState.isInitialized &&
      // The AccountAdder could have been already initialized with the same or a
      // different type. Navigate immediately only if the types match.
      ['ledger', 'trezor', 'lattice'].includes(accountAdderCtrlState.type)
    ) {
      navigate(WEB_ROUTES.accountAdder)
    }
  }, [accountAdderCtrlState.isInitialized, accountAdderCtrlState.type, navigate])

  const onTrezorPress = useCallback(() => {
    if (isSafari()) {
      addToast(
        t(
          "Your browser doesn't support WebUSB, which is required for the Trezor device. Please try using a different browser."
        ),
        { type: 'error' }
      )
    } else {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR' })
    }
  }, [dispatch, addToast, t])

  const onGridPlusPress = useCallback(
    () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE' }),
    [dispatch]
  )

  const onLedgerPress = useCallback(() => setIsLedgerConnectModalVisible(true), [])
  const onLedgerModalClose = useCallback(() => setIsLedgerConnectModalVisible(false), [])
  const onLedgerConnect = useCallback(
    () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER' }),
    [dispatch]
  )

  const isLatticeLoading = mainCtrlState.statuses.handleAccountAdderInitLattice !== 'INITIAL'

  const options = useMemo(
    () => getOptions({ onGridPlusPress, onLedgerPress, onTrezorPress }),
    [onGridPlusPress, onTrezorPress, onLedgerPress]
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
      footer={<BackButton fallbackBackRoute={ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Select your hardware wallet')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option, index) => (
              <HardwareWalletSelectorItem
                style={[flexbox.flex1, index === 1 ? spacings.mh : {}]}
                key={option.title}
                title={
                  option.id === 'lattice' && isLatticeLoading ? t('Connecting...') : option.title
                }
                models={option.models}
                image={option.image}
                onPress={option.onPress}
                // While Lattice is loading, disable all other options temporarily.
                // No need to do this for the other hardware wallets, since their
                // connection flow is different (and specific).
                isDisabled={isLatticeLoading}
              />
            ))}
          </View>
        </Panel>
        <LedgerConnectModal
          isVisible={isLedgerConnectModalVisible}
          handleClose={onLedgerModalClose}
          handleOnConnect={onLedgerConnect}
        />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default HardwareWalletSelectorScreen
