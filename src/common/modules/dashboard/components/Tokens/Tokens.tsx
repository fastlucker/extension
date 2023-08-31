import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import styles from './styles'
import TokenItem from './TokenItem'

// TODO: correct props once connected with portfolio controller
interface Props {
  tokens: any[] | TokenResultInterface[]
}

const Tokens = ({ tokens }: Props) => {
  const { t } = useTranslation()
  // TODO: we will have different sorting here on v2. We will have pinned tokens with 0 balance, gas tokens and etc so this will be decided over time once all of them are wired up
  const sortedTokens = tokens

  return (
    <View>
      {/* {!!isCurrNetworkBalanceLoading && <TokensListLoader />} */}

      {/* // TODO: Implement rewards token */}
      {/* {!isCurrNetworkBalanceLoading && <Rewards />} */}

      {!sortedTokens.length && <Text>{t('No tokens yet')}</Text>}

      {!!sortedTokens.length &&
        sortedTokens.map(
          ({
            address,
            amount,
            decimals,
            networkId,
            priceIn,
            symbol,
            gasToken,
            vesting,
            rewards
          }: any) => (
            <TokenItem
              key={`token-${address}-${networkId}-${gasToken}-${vesting}-${rewards}`}
              address={address}
              amount={amount}
              decimals={decimals}
              networkId={networkId}
              priceIn={priceIn}
              symbol={symbol}
              gasToken={gasToken}
              vesting={vesting}
              rewards={rewards}
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
    </View>
  )
}

export default Tokens
