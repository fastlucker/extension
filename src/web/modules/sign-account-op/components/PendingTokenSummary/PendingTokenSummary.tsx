import { formatUnits } from 'ethers'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { PendingToken } from '@ambire-common/libs/portfolio/portfolioView'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import styles from './styles'

interface Props {
  token: PendingToken
  networkId: NetworkDescriptor['id']
}

const PendingTokenSummary = ({ token, networkId }: Props) => {
  const priceInUsd = useMemo(() => {
    if (!token.decimals) return null

    const usdPrice = token.priceIn.find(
      ({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd'
    )?.price

    if (!usdPrice) return null

    const value = usdPrice * Number(formatUnits(token.amountToSend, token.decimals))

    if (Number.isInteger(value)) return value.toString()

    return value.toPrecision(2)
  }, [token])

  const amountToSendSign = useMemo(() => {
    if (token.type === 'send') return '-'
    if (token.type === 'receive') return '+'

    return ''
  }, [token.type])

  const amountToSendTextColor = useMemo(() => {
    if (token.type === 'send') return colors.radicalRed
    if (token.type === 'receive') return colors.greenHaze

    return colors.martinique
  }, [token.type])

  return (
    <View style={[styles.container]}>
      <View style={spacings.mrTy}>
        <TokenIcon width={24} height={24} networkId={networkId} address={token.address} />
      </View>
      <Text fontSize={16} weight="medium" color={amountToSendTextColor}>
        {`${amountToSendSign}${formatUnits(token.amountToSend, token.decimals || 18)}`}
        <Text fontSize={16} weight="medium">{` ${token.symbol}`}</Text>
      </Text>
      {!!priceInUsd && <Text fontSize={16} weight="medium">{` ($${priceInUsd}) `}</Text>}
    </View>
  )
}

export default React.memo(PendingTokenSummary)
