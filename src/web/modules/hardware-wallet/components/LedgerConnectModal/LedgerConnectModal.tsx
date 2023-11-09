import React, { useEffect } from 'react'
import { View } from 'react-native'

import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import Button from '@common/components/Button'
import Modal from '@common/components/Modal'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { hasConnectedLedgerDevice } from '@web/modules/hardware-wallet/utils/ledger'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const LedgerConnectModal = ({ isOpen, onClose }: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()

  const { dispatchAsync } = useBackgroundService()

  useEffect(() => {
    updateStepperState('connect-hardware-wallet', 'hw')
  }, [updateStepperState])

  const onPressNext = async () => {
    const supportWebHID = await TransportWebHID.isSupported()
    const hasConnectedLedger = await hasConnectedLedgerDevice()

    if (!supportWebHID) {
      navigate(WEB_ROUTES.accountAdder, {
        state: {
          keyType: 'ledger',
          isWebHID: false
        }
      })
    } else if (hasConnectedLedger) {
      navigate(WEB_ROUTES.accountAdder, {
        state: {
          keyType: 'ledger',
          isWebHID: true
        }
      })
    } else {
      try {
        const transport = await TransportWebHID.create()
        await transport.close()
        await dispatchAsync({ type: 'LEDGER_CONTROLLER_AUTHORIZE_HID_PERMISSION' })

        navigate(WEB_ROUTES.accountAdder, {
          state: {
            keyType: 'ledger',
            isWebHID: true
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <Modal title={t('Connect your HW wallet')} isOpen={isOpen} onClose={onClose}>
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
        text={t('Next')}
        style={{ width: 264, ...flexbox.alignSelfCenter }}
        onPress={onPressNext}
      />
    </Modal>
  )
}

export default LedgerConnectModal
