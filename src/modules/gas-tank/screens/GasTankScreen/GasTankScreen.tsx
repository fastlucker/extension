import React from 'react'

import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import GasTankBalance from '@modules/gas-tank/components/GasTankBalance'
import GasTankStateToggle from '@modules/gas-tank/components/GasTankStateToggle'
import useGasTankData from '@modules/gas-tank/hooks/useGasTankData'

const GasTankScreen = () => {
  const { t } = useTranslation()
  const { data } = useGasTankData()

  const balanceLabel = !data
    ? '0.00'
    : data
        .map(({ balanceInUSD }: any) => balanceInUSD)
        .reduce((a: any, b: any) => a + b, 0)
        .toFixed(2)

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <Text style={[textStyles.center, spacings.mbTy]} fontSize={16} weight="medium">
          {t('Reduce fees by enabling the gas tank.')}
        </Text>
        <GasTankStateToggle />
        <Panel>
          <GasTankBalance balance={balanceLabel} />
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default GasTankScreen
