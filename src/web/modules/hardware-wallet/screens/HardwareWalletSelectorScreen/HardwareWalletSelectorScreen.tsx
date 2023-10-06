import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

import HardwareWalletSelectorItem from '../../components/HardwareWalletSelectorItem'
import getOptions from './options'

const HardwareWalletSelectorScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { updateStepperState } = useStepper()
  const { dispatchAsync } = useBackgroundService()

  useEffect(() => {
    updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
  }, [updateStepperState])

  const onTrezorPress = useCallback(async () => {
    try {
      await updateStepperState('connect-hardware-wallet', 'hw')
      await dispatchAsync({ type: 'TREZOR_CONTROLLER_UNLOCK' })
      navigate(WEB_ROUTES.accountAdder, {
        state: { keyType: 'trezor' }
      })
    } catch (error: any) {
      addToast(error.message, { error: true })
      await updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
    }
  }, [addToast, dispatchAsync, navigate, updateStepperState])

  const onLedgerPress = useCallback(async () => {
    await updateStepperState('connect-hardware-wallet', 'hw')
    navigate(WEB_ROUTES.hardwareWalletLedger)
  }, [navigate, updateStepperState])

  const onGridPlusPress = useCallback(async () => {
    try {
      await updateStepperState('connect-hardware-wallet', 'hw')

      await dispatchAsync({ type: 'LATTICE_CONTROLLER_UNLOCK' })
      navigate(WEB_ROUTES.accountAdder, {
        state: { keyType: 'lattice' }
      })
    } catch (error: any) {
      addToast(error.message, { error: true })
      await updateStepperState(WEB_ROUTES.hardwareWalletSelect, 'hw')
    }
  }, [addToast, dispatchAsync, navigate, updateStepperState])

  const options = useMemo(
    () => getOptions({ onGridPlusPress, onLedgerPress, onTrezorPress }),
    [onGridPlusPress, onLedgerPress, onTrezorPress]
  )

  return (
    <TabLayoutWrapperMainContent width="md">
      <View style={[flexbox.center]}>
        <Text fontSize={16} style={[spacings.mvLg, flexbox.alignSelfCenter]} weight="medium">
          {t('Choose Hardware Wallet')}
        </Text>
        <View style={[flexbox.directionRow]}>
          {options.map((option, index) => (
            <HardwareWalletSelectorItem
              style={index === 1 ? spacings.mhSm : {}}
              key={option.title}
              title={option.title}
              text={option.text}
              image={option.image}
              onPress={option.onPress}
            />
          ))}
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default HardwareWalletSelectorScreen
