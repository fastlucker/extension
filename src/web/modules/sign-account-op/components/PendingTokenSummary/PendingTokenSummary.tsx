import { formatUnits } from 'ethers'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { PendingToken } from '@ambire-common/libs/portfolio/portfolioView'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import formatDecimals from '@common/utils/formatDecimals'

import getStyles from './styles'

interface Props {
  token: PendingToken
  networkId: NetworkDescriptor['id']
  hasBottomSpacing?: boolean
}

const PendingTokenSummary = ({ token, networkId, hasBottomSpacing = true }: Props) => {
  const { styles } = useTheme(getStyles)

  const priceInUsd = useMemo(() => {
    if (!token.decimals) return null

    const usdPrice = token.priceIn.find(
      ({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd'
    )?.price

    if (!usdPrice) return null

    const value = usdPrice * Number(formatUnits(token.amountToSend, token.decimals))

    return formatDecimals(value)
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
    <View style={[styles.container, !hasBottomSpacing && spacings.mb0]}>
      <View style={spacings.mrTy}>
        <TokenIcon
          width={20}
          height={20}
          networkId={networkId}
          address={token.address}
          withNetworkIcon={false}
        />
      </View>
      <Text selectable fontSize={16} weight="medium" color={amountToSendTextColor}>
        {`${amountToSendSign}${formatDecimals(
          Number(formatUnits(token.amountToSend, token.decimals || 18))
        )}`}
        <Text fontSize={16} weight="medium">
          {` ${token.symbol}`}
        </Text>
        {!!priceInUsd && <Text fontSize={16} weight="medium">{` ($${priceInUsd}) `}</Text>}
      </Text>
    </View>
  )
}

export default React.memo(PendingTokenSummary)
