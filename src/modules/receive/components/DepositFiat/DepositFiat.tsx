import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UseNetworkReturnType } from 'ambire-common/src/hooks/useNetwork'
import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import Providers from '@modules/receive/components/Providers'

interface Props {
  network: UseNetworkReturnType['network']
  selectedAcc: UseAccountsReturnType['selectedAcc']
}

const DepositFiat: React.FC<Props> = ({ selectedAcc, network }) => {
  const { t } = useTranslation()

  return (
    <Panel>
      <Text style={spacings.mbSm} fontSize={16} weight="medium" color={colors.turquoise}>
        {t('Credit Card & Bank Transfer')}
      </Text>
      <Text style={[spacings.mb, spacings.ph]} fontSize={12}>
        {t('Deposit with credit card to your account directly using one of our partners')}
      </Text>
      <Providers walletAddress={selectedAcc} networkDetails={network} />
    </Panel>
  )
}

export default DepositFiat
