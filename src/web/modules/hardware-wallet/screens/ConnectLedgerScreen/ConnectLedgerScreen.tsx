import React from 'react'
import { View } from 'react-native'

import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'
import { hasConnectedLedgerDevice } from '@web/modules/hardware-wallet/utils/ledger'

const ConnectLedgerScreen = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { hardwareWallets } = useHardwareWallets()

  const onSubmit = async () => {
    const supportWebHID = await TransportWebHID.isSupported()
    const hasConnectedLedger = await hasConnectedLedgerDevice()

    if (!supportWebHID) {
      navigate(WEB_ROUTES.accountsImporter, {
        state: {
          walletType: HARDWARE_WALLETS.LEDGER,
          isWebHID: false
        }
      })
    } else if (hasConnectedLedger) {
      navigate(WEB_ROUTES.accountsImporter, {
        state: {
          walletType: HARDWARE_WALLETS.LEDGER,
          isWebHID: true
        }
      })
    } else {
      try {
        const transport = await TransportWebHID.create()
        await transport.close()
        await hardwareWallets[HARDWARE_WALLETS.LEDGER].authorizeHIDPermission()

        navigate(WEB_ROUTES.accountsImporter, {
          state: {
            walletType: HARDWARE_WALLETS.LEDGER,
            isWebHID: true
          }
        })
      } catch (e) {}
    }
  }

  return (
    <AuthLayoutWrapperMainContent fullWidth>
      <View style={[flexbox.flex1, flexbox.justifyCenter]}>
        <View
          style={{
            backgroundColor: colors.melrose_15,
            paddingTop: 50,
            paddingBottom: 50
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
    </AuthLayoutWrapperMainContent>
  )
}

export default ConnectLedgerScreen
