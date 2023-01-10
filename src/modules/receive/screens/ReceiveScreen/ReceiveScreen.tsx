import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import DepositFiat from '@modules/receive/components/DepositFiat'
import DepositTokens from '@modules/receive/components/DepositTokens'

const ReceiveScreen = () => {
  const { selectedAcc } = useAccounts()
  const { network } = useNetwork()

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <DepositTokens selectedAcc={selectedAcc} networkId={network?.id} />
        {/* TODO: Temporary disabled for iOS since v1.6.0 as part of the Apple app review feedback */}
        {/* Also excluded from the bundle by including an empty DepositFiat.ios.tsx */}
        <DepositFiat selectedAcc={selectedAcc} network={network} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ReceiveScreen
