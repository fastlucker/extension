import React, { useEffect } from 'react'
import { Trans } from 'react-i18next'
import { View } from 'react-native'

import grid from '@common/assets/images/GRID-Lattice.png'
import ledger from '@common/assets/images/ledger.png'
import trezor from '@common/assets/images/trezor.png'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import HardwareWalletSelectorItem from '@web/modules/hardware-wallet/components/HardwareWalletSelectorItem'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

const HardwareWalletSelectorScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { hardwareWallets } = useHardwareWallets()
  const { addToast } = useToast()
  const { updateStepperState } = useStepper()

  return (
    <AuthLayoutWrapperMainContent fullWidth>
      <View>
        <Text fontSize={20} style={[spacings.mvLg, flexbox.alignSelfCenter]} weight="medium">
          {t('Choose Hardware Wallet')}
        </Text>
        <View style={flexbox.directionRow}>
          <HardwareWalletSelectorItem
            name="Trezor"
            text={
              <Trans>
                <strong>Supported</strong>: Trezor Model T, Trezor One
              </Trans>
            }
            icon={trezor}
            onSelect={async () => {
              try {
                await updateStepperState(1, 'hwAuth')
                await hardwareWallets[HARDWARE_WALLETS.TREZOR].unlock()
                navigate(WEB_ROUTES.accountAdder, {
                  state: { walletType: HARDWARE_WALLETS.TREZOR }
                })
              } catch (error: any) {
                addToast(error.message, { error: true })
              }
            }}
          />
          <HardwareWalletSelectorItem
            name="Ledger"
            icon={ledger}
            text={
              <Trans>
                <strong>Supported</strong>: Ledger Nano, Ledger Nano X, Ledger Nano S Plus, Ledger
                Stax
              </Trans>
            }
            style={{ marginHorizontal: 16 }}
            onSelect={async () => {
              await updateStepperState(1, 'hwAuth')
              navigate(WEB_ROUTES.hardwareWalletLedger)
            }}
          />
          <HardwareWalletSelectorItem
            name="GRID+"
            icon={grid}
            text={
              <Trans>
                <strong>Supported</strong>: Lattice1 GRID+
              </Trans>
            }
            onSelect={async () => {
              try {
                await updateStepperState(1, 'hwAuth')

                await hardwareWallets[HARDWARE_WALLETS.GRIDPLUS].unlock()
                navigate(WEB_ROUTES.accountAdder, {
                  state: { walletType: HARDWARE_WALLETS.GRIDPLUS }
                })
              } catch (error: any) {
                addToast(error.message, { error: true })
              }
            }}
          />
        </View>
      </View>
    </AuthLayoutWrapperMainContent>
  )
}

export default HardwareWalletSelectorScreen
