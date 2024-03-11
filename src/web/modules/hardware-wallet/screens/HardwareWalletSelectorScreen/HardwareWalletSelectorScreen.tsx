import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
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
  const { updateStepperState } = useStepper()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const { dispatch } = useBackgroundService()
  const { theme } = useTheme()
  const { ref: ledgerModalRef, open: openLedgerModal, close: closeLedgerModal } = useModalize()

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

  const onTrezorPress = useCallback(
    () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR' }),
    [dispatch]
  )

  const onGridPlusPress = useCallback(async () => {
    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE' })
  }, [dispatch])

  const options = useMemo(
    () => getOptions({ onGridPlusPress, onLedgerPress: openLedgerModal, onTrezorPress }),
    [onGridPlusPress, onTrezorPress, openLedgerModal]
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
        <LedgerConnectModal modalRef={ledgerModalRef} handleClose={closeLedgerModal} />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default HardwareWalletSelectorScreen
