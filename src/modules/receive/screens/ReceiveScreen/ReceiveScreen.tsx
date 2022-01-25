import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import DepositTokens from '@modules/receive/components/DepositTokens'
import Providers from '@modules/receive/components/Providers'

const ReceiveScreen = () => {
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const { network }: any = useNetwork()

  return (
    <Wrapper>
      <DepositTokens />
      <Panel>
        <View style={[flexboxStyles.alignCenter, spacings.mb]}>
          <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mbMi]}>
            <MaterialIcons
              style={spacings.mrTy}
              name="account-balance"
              size={25}
              color={colors.primaryAccentColor}
            />
            <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
              {t('Fiat Currency')}
            </Title>
          </View>
          <Text fontSize={20} color={colors.ambirePurple}>
            {t('Credit Card & Bank Transfer')}
          </Text>
        </View>

        <View>
          <Text style={spacings.mb}>
            {t('Deposit with credit card to your account directly using one of our partners')}
          </Text>
          <Providers walletAddress={selectedAcc} networkDetails={network} />
        </View>
      </Panel>
    </Wrapper>
  )
}

export default ReceiveScreen
