import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { useTranslation } from '@common/config/localization'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import { hasConnectedLedgerDevice } from '@web/modules/hardware-wallet/utils/ledger'
import AmbireScreen from '@web/modules/hardware-wallet/screens/ConnectLedgerScreen/Ambire'
import Drive from '@web/modules/hardware-wallet/screens/ConnectLedgerScreen/Drive'
import ArrowIcon from '@web/modules/hardware-wallet/screens/ConnectLedgerScreen/ArrowIcon'

import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

const ConnectLedgerScreen = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

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
      navigate(WEB_ROUTES.hardwareWalletLedgerPermission)
    }
  }

  return (
    <AuthLayoutWrapperMainContent fullWidth>
      <Wrapper>
        <View
          style={{
            backgroundColor: colors.melrose_15,
            ...flexbox.alignCenter,
            paddingTop: 50,
            paddingBottom: 50
          }}
        >
          <Text weight="medium" style={{ marginBottom: 16 }} fontSize={20}>
            {t('Connect your HW wallet')}
          </Text>
          <Text fontSize={16}>{t('1. Plug your Ledger wallet into your computer')}</Text>
          <Text fontSize={16} style={{ marginBottom: 40 }}>
            {t('2. Unlock Ledger and open the Ethereum app')}
          </Text>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
            <Drive style={{ ...spacings.mrLg }} />
            <ArrowIcon style={{ ...spacings.mrLg }} />
            <AmbireScreen />
          </View>
          <Button text="Next" style={{ width: 264 }} onPress={onSubmit} />
        </View>
      </Wrapper>
    </AuthLayoutWrapperMainContent>
  )
}

export default ConnectLedgerScreen
