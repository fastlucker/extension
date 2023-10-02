import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'
import TokenItem from './TokenItem'

// TODO: correct props once connected with portfolio controller
interface Props {
  tokens: any[] | TokenResultInterface[]
  searchValue: string
}

const Tokens = ({ tokens, searchValue }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  // TODO: we will have different sorting here on v2. We will have pinned tokens with 0 balance, gas tokens and etc so this will be decided over time once all of them are wired up
  let sortedTokens = [...tokens]

  sortedTokens.sort((a, b) => {
    // If a is a rewards token and b is not, a should come before b.
    if (a.flags.rewardsType && !b.flags.rewardsType) {
      return -1
    }
    // If b is a rewards token and a is not, b should come before a.
    if (!a.flags.rewardsType && b.flags.rewardsType) {
      return 1
    }
    // Otherwise, keep the order as is (or use another criteria to sort them).
    return 0
  })

  // Now, move onGasTank tokens to the end of the array
  const onGasTankTokens = sortedTokens.filter((token) => token.flags.onGasTank)
  const otherTokens = sortedTokens.filter((token) => !token.flags.onGasTank)

  sortedTokens = [...otherTokens, ...onGasTankTokens]

  return (
    <View>
      {/* {!!isCurrNetworkBalanceLoading && <TokensListLoader />} */}

      {!sortedTokens.length && !searchValue && <Text>{t('No tokens yet')}</Text>}
      {!sortedTokens.length && searchValue && <Text>{t('No tokens found')}</Text>}

      {!!sortedTokens.length &&
        sortedTokens.map(
          (
            {
              address,
              amount,
              decimals,
              networkId,
              priceIn,
              symbol,
              flags: { onGasTank, rewardsType, canTopUpGasTank, isFeeToken }
            }: TokenResultInterface,
            i: number
          ) => (
            <TokenItem
              key={`token-${i}`}
              address={address}
              amount={amount}
              decimals={decimals}
              networkId={networkId}
              priceIn={priceIn}
              symbol={symbol}
              onGasTank={onGasTank}
              rewardsType={rewardsType}
              canTopUpGasTank={canTopUpGasTank}
              isFeeToken={isFeeToken}
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
                backgroundColor: theme.primaryLight,
                borderStyle: 'solid',
                borderColor: theme.primary
              }
            ]}
          >
            <Text shouldScale={false} appearance="primary" weight="medium" fontSize={16}>
              {t('+ Add Custom')}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  )
}

export default Tokens
