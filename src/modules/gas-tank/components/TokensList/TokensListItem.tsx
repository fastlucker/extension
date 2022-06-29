import React from 'react'
import { View } from 'react-native'

import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import TokenIcon from '@modules/common/components/TokenIcon'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  img: any
  symbol: string
  balanceUSD: number
  address: string
  networkId: string | undefined
  onPress: (symbol: string) => any
}

const TokensListItem = ({ img, symbol, balanceUSD, address, networkId, onPress }: Props) => {
  return (
    <View style={styles.tokenItemContainer}>
      <View style={spacings.prTy}>
        <TokenIcon withContainer uri={img} networkId={networkId} address={address} />
      </View>

      <Text fontSize={14} style={[spacings.prSm, styles.tokenSymbol]} numberOfLines={2}>
        {symbol}
      </Text>

      <View style={[flexboxStyles.flex1]}>
        <Text fontSize={14}>${balanceUSD.toFixed(2)}</Text>
      </View>

      <View style={spacings.plTy}>
        <Button
          text="Deposit"
          size="small"
          type="outline"
          hasBottomSpacing={false}
          style={styles.depositButton}
          textStyle={styles.depositButtonText}
          disabled={balanceUSD === 0}
          onPress={() => null}
        />
      </View>
    </View>
  )
}

export default React.memo(TokensListItem)
