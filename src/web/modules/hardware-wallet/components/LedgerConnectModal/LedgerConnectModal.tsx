import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import wait from '@ambire-common/utils/wait'
import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import BottomSheet from '@common/components/BottomSheet'
import ModalHeader from '@common/components/BottomSheet/ModalHeader'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'

import LedgerController from '../../controllers/LedgerController'

type Props = {
  modalRef: any
  handleClose: () => void
}

const LedgerConnectModal = ({ modalRef, handleClose }: Props) => {
  const { addToast } = useToast()
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const [isConnectingToDevice, setIsConnectingToDevice] = useState(false)

  useEffect(() => {
    updateStepperState('connect-hardware-wallet', 'hw')
  }, [updateStepperState])

  const onPressNext = async () => {
    setIsConnectingToDevice(true)

    try {
      const isSupported = await LedgerController.isSupported()
      if (!isSupported) {
        const message =
          "Your browser doesn't support WebHID, which is required for the Ledger device. Please try using a different browser."
        return addToast(message, { type: 'error' })
      }

      // The WebHID API requires a user gesture to open the device selection prompt
      // where users grant permission to the extension to access an HID device.
      // Therefore, force unlocking the Ledger device on the foreground.
      await LedgerController.grantDevicePermission()

      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER' })
    } catch (error: any) {
      addToast(error.message, { type: 'error' })
    } finally {
      // FIXME: There is no loading flag for the 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER',
      // so as a workaround, wait a bit before allowing the user to try again while the
      // initialization is in progress. When initialization is done, user gets redirected.
      await wait(2000)
      // Clear the flag to allow the user to try again. For all other cases,
      // the state gets reset automatically, because the on connect success
      // the flow redirects the user to another route (and this component unmounts).
      setIsConnectingToDevice(false)
    }
  }

  return (
    <BottomSheet
      id="ledger-connect-modal"
      sheetRef={modalRef}
      closeBottomSheet={handleClose}
      backgroundColor="primaryBackground"
      autoWidth={false}
    >
      <ModalHeader title={t('Connect your HW wallet')} />
      <View style={[flexbox.alignSelfCenter, spacings.mbSm]}>
        <Text weight="regular" style={spacings.mbTy} fontSize={14}>
          {t('1. Plug your Ledger device into your computer')}
        </Text>
        <Text weight="regular" fontSize={14} style={{ marginBottom: 40 }}>
          {t('2. Unlock your Ledger and open the Ethereum app')}
        </Text>
      </View>
      <View
        style={[flexbox.directionRow, flexbox.alignSelfCenter, flexbox.alignCenter, spacings.mb3Xl]}
      >
        <DriveIcon style={spacings.mrLg} />
        <LeftPointerArrowIcon style={spacings.mrLg} />
        <AmbireDevice />
      </View>
      <Button
        text={isConnectingToDevice ? t('Connecting...') : t('Next')}
        disabled={isConnectingToDevice}
        style={{ width: 264, ...flexbox.alignSelfCenter }}
        onPress={onPressNext}
      />
    </BottomSheet>
  )
}

export default LedgerConnectModal
