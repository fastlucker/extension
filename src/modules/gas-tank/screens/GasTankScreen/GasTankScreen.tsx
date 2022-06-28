import React, { useMemo } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import GasTankBalance from '@modules/gas-tank/components/GasTankBalance'
import GasTankStateToggle from '@modules/gas-tank/components/GasTankStateToggle'
import GasTankTotalSave from '@modules/gas-tank/components/GasTankTotalSave'
import useGasTankData from '@modules/gas-tank/hooks/useGasTankData'

const GasTankScreen = () => {
  const { t } = useTranslation()
  const { data, gasTankTxns } = useGasTankData()

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
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <Text style={[textStyles.center, spacings.mbTy]} fontSize={16} weight="medium">
          {t('Reduce fees by enabling the gas tank.')}
        </Text>
        <GasTankStateToggle />
        <Panel>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            <GasTankBalance balance={balanceLabel} />
            <GasTankTotalSave totalSave={totalSaveLabel} />
          </View>
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default GasTankScreen
