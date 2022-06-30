import React, { useContext } from 'react'
import { View } from 'react-native'

import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import TokenIcon from '@modules/common/components/TokenIcon'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { DepositTokenBottomSheetContext } from '@modules/gas-tank/contexts/depositTokenBottomSheetContext'

import styles from './styles'

type Props = {
  token: any
  networkId: string | undefined
}

const TokensListItem = ({ token, networkId }: Props) => {
  const { openDepositToken } = useContext(DepositTokenBottomSheetContext)

  return (
    <View style={styles.tokenItemContainer}>
      <View style={spacings.prTy}>
        <TokenIcon
          withContainer
          uri={token.img || token.tokenImageUrl}
          networkId={networkId}
          address={token.address}
        />
      </View>

      <Text fontSize={14} style={[spacings.prSm, styles.tokenSymbol]} numberOfLines={2}>
        {token.symbol}
      </Text>

      <View style={[flexboxStyles.flex1]}>
        <Text fontSize={14}>${token.balanceUSD.toFixed(2)}</Text>
      </View>

      <View style={spacings.plTy}>
        <Button
          text="Deposit"
          size="small"
          type="outline"
          hasBottomSpacing={false}
          style={styles.depositButton}
          textStyle={styles.depositButtonText}
          disabled={token.balanceUSD === 0}
          onPress={() => openDepositToken(token)}
        />
      </View>
    </View>
  )
}

export default React.memo(TokensListItem)
