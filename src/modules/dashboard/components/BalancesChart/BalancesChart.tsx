import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useTranslation } from '@config/localization'
import ButtonSegment from '@modules/common/components/ButtonSegment'
import Panel from '@modules/common/components/Panel'
import PieChart from '@modules/common/components/PieChart'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

enum CHART_TYPES {
  TOKENS = 'tokens',
  PROTOCOLS = 'protocols'
}

const BalancesChart = () => {
  const { t } = useTranslation()
  const {
    isBalanceLoading,
    areProtocolsLoading,
    requestOtherProtocolsRefresh,
    balance,
    protocols,
    tokens
  } = usePortfolio()
  const [chartTokensData, setChartTokensData] = useState([])
  const [chartProtocolsData, setChartProtocolsData] = useState([])
  const [chartType, setChartType] = useState(CHART_TYPES.TOKENS)

  const chartSegments = [
    {
      value: 'Tokens'
    },
    {
      value: 'Protocols'
    }
  ]

  const tableSegments = [
    {
      value: 'Tokens'
    },
    {
      value: 'Collectibles'
    }
  ]

  useLayoutEffect(() => {
    const tokensData = tokens
      .map(({ label, symbol, balanceUSD }) => ({
        label: label || symbol,
        value: Number(((balanceUSD / balance.total.full) * 100).toFixed(2))
      }))
      .filter(({ value }) => value > 0)

    const totalProtocols = protocols
      .map(({ assets }) =>
        assets.map(({ balanceUSD }) => balanceUSD).reduce((acc, curr) => acc + curr, 0)
      )
      .reduce((acc, curr) => acc + curr, 0)

    const protocolsData = protocols
      .map(({ label, assets }) => ({
        label,
        value: Number(
          (
            (assets.map(({ balanceUSD }) => balanceUSD).reduce((acc, curr) => acc + curr, 0) /
              totalProtocols) *
            100
          ).toFixed(2)
        )
      }))
      .filter(({ value }) => value > 0)

    setChartTokensData(tokensData)
    setChartProtocolsData(protocolsData)
  }, [balance, tokens, protocols])

  useEffect(() => requestOtherProtocolsRefresh(), [tokens, protocols])

  const pieChartTokensData = chartTokensData.map(({ value, label }) => ({
    y: value,
    name: label,
    symbol: { type: 'square' }
  }))

  const pieChartProtocolsData = chartProtocolsData.map(({ value, label }) => ({
    y: value,
    name: label,
    symbol: { type: 'square' }
  }))

  return (
    <Panel>
      <View style={[flexboxStyles.directionRow, spacings.mbSm]}>
        <Title style={flexboxStyles.flex1}>{t('Balance by')}</Title>
        <ButtonSegment
          onPress={() => setChartType(CHART_TYPES.TOKENS)}
          text={t('Tokens')}
          isActive={chartType === CHART_TYPES.TOKENS}
          style={spacings.mlTy}
        />
        <ButtonSegment
          onPress={() => setChartType(CHART_TYPES.PROTOCOLS)}
          text={t('Protocols')}
          isActive={chartType === CHART_TYPES.PROTOCOLS}
          style={spacings.mlTy}
        />
      </View>
      {chartType === CHART_TYPES.TOKENS &&
        (isBalanceLoading ? (
          <ActivityIndicator />
        ) : (
          <PieChart data={[...pieChartTokensData, ...pieChartTokensData]} />
        ))}
      {chartType === CHART_TYPES.PROTOCOLS &&
        (areProtocolsLoading ? <ActivityIndicator /> : <PieChart data={pieChartProtocolsData} />)}
    </Panel>
  )
}

export default BalancesChart
