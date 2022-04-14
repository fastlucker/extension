import React from 'react'
import { useTranslation } from 'react-i18next'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import DepositTokens from '@modules/receive/components/DepositTokens'
import Providers from '@modules/receive/components/Providers'

const ReceiveScreen = () => {
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const { network }: any = useNetwork()

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <DepositTokens />
        <Panel>
          <Text style={spacings.mb} fontSize={16} weight="medium" color={colors.turquoise}>
            {t('Credit Card & Bank Transfer')}
          </Text>
          <Text style={[spacings.mb, spacings.ph]} fontSize={12}>
            {t('Deposit with credit card to your account directly using one of our partners')}
          </Text>
          <Providers walletAddress={selectedAcc} networkDetails={network} />
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ReceiveScreen
