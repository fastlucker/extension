import React from 'react'
import { View } from 'react-native'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'
import HardwareWalletSelectorItem from '@web/modules/hardware-wallet/components/HardwareWalletSelectorItem'

const HardwareWalletSelectorScreen = () => {
  const { navigate } = useNavigation()
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <View style={flexbox.directionRow}>
          <HardwareWalletSelectorItem name="Trezor" />
          <HardwareWalletSelectorItem
            name="Ledger"
            onSelect={() => navigate(WEB_ROUTES.hardwareWalletLedger)}
          />
          <HardwareWalletSelectorItem name="GRID+" />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default HardwareWalletSelectorScreen
