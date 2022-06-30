import React, { useMemo } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import GasTankBalance from '@modules/gas-tank/components/GasTankBalance'
import GasTankStateToggle from '@modules/gas-tank/components/GasTankStateToggle'
import GasTankTotalSave from '@modules/gas-tank/components/GasTankTotalSave'
import TokensList from '@modules/gas-tank/components/TokensList'
import { DepositTokenProvider } from '@modules/gas-tank/contexts/depositTokenContext'
import useGasTankData from '@modules/gas-tank/hooks/useGasTankData'

const GasTankScreen = () => {
  const { t } = useTranslation()
  const { data, gasTankTxns, sortedTokens } = useGasTankData()
  const { isCurrNetworkBalanceLoading, isCurrNetworkProtocolsLoading, dataLoaded } = usePortfolio()
  const { network } = useNetwork()
  const balanceLabel = useMemo(
    () =>
      !data
        ? '0.00'
        : data
            .map(({ balanceInUSD }: any) => balanceInUSD)
            .reduce((a: any, b: any) => a + b, 0)
            .toFixed(2),
    [data]
  )

  const totalSaveLabel = useMemo(
    () =>
      gasTankTxns && gasTankTxns.length
        ? gasTankTxns
            .map((item: any) => item.feeInUSDPerGas * item.gasLimit)
            .reduce((a: any, b: any) => a + b)
            .toFixed(2)
        : '0.00',
    [gasTankTxns]
  )

  return (
    <DepositTokenProvider networkId={network?.id}>
      <GradientBackgroundWrapper>
        <Wrapper hasBottomTabNav={false}>
          <GasTankStateToggle />
          <Text style={[spacings.mbSm, spacings.mhSm]} fontSize={12}>
            {t(
              'The Ambire Gas Tank is your special account for paying gas and saving on gas fees.'
            )}
            <Text color={colors.heliotrope} fontSize={12}>{`   ${t('learn more...')}`}</Text>
          </Text>
          <Panel>
            <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
              <GasTankBalance balance={balanceLabel} />
              <GasTankTotalSave totalSave={totalSaveLabel} />
            </View>
            <TokensList
              tokens={sortedTokens}
              isLoading={
                (isCurrNetworkBalanceLoading || isCurrNetworkProtocolsLoading) && !dataLoaded
              }
              networkId={network?.id}
            />
          </Panel>
        </Wrapper>
      </GradientBackgroundWrapper>
    </DepositTokenProvider>
  )
}

export default GasTankScreen
