import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

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
  const { dispatchAsync } = useBackgroundService()
  const { theme } = useTheme()
  const { ref: ledgerModalRef, open: openLedgerModal, close: closeLedgerModal } = useModalize()

  useEffect(() => {
    updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
  }, [updateStepperState])

  const onTrezorPress = useCallback(async () => {
    try {
      // No need for a separate request to unlock Trezor, it's done in the background
      navigate(WEB_ROUTES.accountAdder, {
        state: { keyType: 'trezor' }
      })
    } catch (error: any) {
      addToast(error.message, { type: 'error' })
    }
  }, [addToast, navigate])

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
