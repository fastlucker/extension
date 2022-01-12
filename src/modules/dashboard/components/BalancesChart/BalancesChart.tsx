import React, { useLayoutEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import PieChart from '@modules/common/components/PieChart'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'

const BalancesChart = () => {
  const { t } = useTranslation()
  const [chartTokensData, setChartTokensData] = useState([])
  const [chartProtocolsData, setChartProtocolsData] = useState([])
  const [chartType, setChartType] = useState([])
  const [tableType, setTableType] = useState([])

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
  const { areProtocolsLoading, requestOtherProtocolsRefresh, balance, protocols, tokens } =
    usePortfolio()

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

  // TODO:
  // useEffect(() => requestOtherProtocolsRefresh(), [portfolio])

  const pieChartData = chartTokensData.map(({ value, label }) => ({
    y: value,
    name: label,
    symbol: { type: 'square' }
  }))

  return (
    <Panel>
      <Title>{t('Balance by')}</Title>
      <PieChart data={pieChartData} />
    </Panel>
  )
}

export default BalancesChart
