import React from 'react'

import { isAndroid } from '@config/env'
import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import DepositTokens from '@modules/receive/components/DepositTokens'
import Providers from '@modules/receive/components/Providers'

const ReceiveScreen = () => {
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const { network } = useNetwork()

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <DepositTokens selectedAcc={selectedAcc} networkId={network?.id} />
        {/* TODO: Temporary disabled only for iOS since v1.6.0 as part of the Apple app review feedback */}
        {isAndroid && (
          <Panel>
            <Text style={spacings.mbSm} fontSize={16} weight="medium" color={colors.turquoise}>
              {t('Credit Card & Bank Transfer')}
            </Text>
            <Text style={[spacings.mb, spacings.ph]} fontSize={12}>
              {t('Deposit with credit card to your account directly using one of our partners')}
            </Text>
            <Providers walletAddress={selectedAcc} networkDetails={network} />
          </Panel>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ReceiveScreen
