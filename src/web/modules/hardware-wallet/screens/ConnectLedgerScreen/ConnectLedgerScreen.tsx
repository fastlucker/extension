import React, { useEffect } from 'react'
import { View } from 'react-native'

import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { hasConnectedLedgerDevice } from '@web/modules/hardware-wallet/utils/ledger'

const ConnectLedgerScreen = () => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()

  const { dispatchAsync } = useBackgroundService()

  useEffect(() => {
    updateStepperState('connect-hardware-wallet', 'hw')
  }, [updateStepperState])

  const onSubmit = async () => {
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
      } catch (e) {}
    }
  }

  return (
    <TabLayoutWrapperMainContent width="md">
      <Text weight="medium" fontSize={16} style={[spacings.mvLg, flexbox.alignSelfCenter]}>
        {t('Login with Hardware Wallet')}
      </Text>

      <View style={[flexbox.flex1]}>
        <View
          style={{
            backgroundColor: colors.melrose_15,
            paddingTop: 50,
            paddingBottom: 50,
            borderRadius: 12
          }}
        >
          <Text weight="medium" style={[spacings.mbSm, flexbox.alignSelfCenter]} fontSize={20}>
            {t('Connect your HW wallet')}
          </Text>
          <View style={{ minWidth: 420, ...flexbox.alignSelfCenter }}>
            <Text weight="regular" style={spacings.mbTy} fontSize={14}>
              {t('1. Plug your Trezor / Ledger wallet into your computer')}
            </Text>
            <Text weight="regular" fontSize={14} style={{ marginBottom: 40 }}>
              {t('2. Unlock Trezor / Ledger and open the Ambire extension')}
            </Text>
          </View>
          <View
            style={[
              flexbox.directionRow,
              flexbox.alignSelfCenter,
              flexbox.alignCenter,
              spacings.mbLg
            ]}
          >
            <DriveIcon style={spacings.mrLg} />
            <LeftPointerArrowIcon style={spacings.mrLg} />
            <AmbireDevice />
          </View>
          <Button
            text="Next"
            style={{ width: 264, ...flexbox.alignSelfCenter }}
            onPress={onSubmit}
          />
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default ConnectLedgerScreen
