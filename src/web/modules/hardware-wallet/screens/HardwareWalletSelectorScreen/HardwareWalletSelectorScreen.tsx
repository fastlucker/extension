import React from 'react'
import { View } from 'react-native'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'
import HardwareWalletSelectorItem from '@web/modules/hardware-wallet/components/HardwareWalletSelectorItem'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

const HardwareWalletSelectorScreen = () => {
  const { navigate } = useNavigation()
  const { hardwareWallets } = useHardwareWallets()
  const { addToast } = useToast()
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <View style={flexbox.directionRow}>
          <HardwareWalletSelectorItem
            name="Trezor"
            onSelect={async () => {
              try {
                await hardwareWallets[HARDWARE_WALLETS.TREZOR].unlock()
              } catch (error: any) {
                addToast(error.message)
              }
              navigate(WEB_ROUTES.accountsImporter, {
                state: { walletType: HARDWARE_WALLETS.TREZOR }
              })
            }}
          />
          <HardwareWalletSelectorItem
            name="Ledger"
            onSelect={() => navigate(WEB_ROUTES.hardwareWalletLedger)}
          />
          <HardwareWalletSelectorItem
            name="GRID+"
            onSelect={async () => {
              try {
                await hardwareWallets[HARDWARE_WALLETS.GRIDPLUS].unlock()
              } catch (error: any) {
                addToast(error.message)
              }
              navigate(WEB_ROUTES.accountsImporter, {
                state: { walletType: HARDWARE_WALLETS.GRIDPLUS }
              })
            }}
          />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default HardwareWalletSelectorScreen
