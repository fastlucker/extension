import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import styles from './styles'
import TokenItem from './TokenItem'

// TODO: correct props once connected with portfolio controller
interface Props {
  tokens: []
}

const Tokens = ({ tokens }: Props) => {
  const { t } = useTranslation()
  // TODO: we will have different sorting here on v2. We will have pinned tokens with 0 balance, gas tokens and etc so this will be decided over time once all of them are wired up
  const sortedTokens = tokens

  // TODO: Calculate each token height and apply scroll
  return (
    <Wrapper contentContainerStyle={[spacings.ph0, spacings.pv0]}>
      {/* {!!isCurrNetworkBalanceLoading && <TokensListLoader />} */}

      {/* // TODO: Implement rewards token */}
      {/* {!isCurrNetworkBalanceLoading && <Rewards />} */}

      {!!sortedTokens.length &&
        sortedTokens.map(
          ({ address, amount, decimals, networkId, priceIn, symbol, gasToken }: any, i: number) => (
            <TokenItem
              key={`token-${address}-${i}`}
              address={address}
              amount={amount}
              decimals={decimals}
              networkId={networkId}
              priceIn={priceIn}
              symbol={symbol}
              gasToken={gasToken}
            />
          )
        )}
      {/* TODO: implementation of add custom token will be in sprint 4 */}
      <Pressable>
        {({ hovered }: any) => (
          <View
            style={[
              styles.container,
              styles.addTokenContainer,
              spacings.pvTy,
              hovered && {
                backgroundColor: colors.lightViolet,
                borderStyle: 'solid',
                borderColor: colors.violet
              }
            ]}
          >
            <Text shouldScale={false} color={colors.violet} weight="medium" fontSize={16}>
              {t('+ Add Custom')}
            </Text>
          </View>
        )}
      </Pressable>
    </Wrapper>
  )
}

export default Tokens
