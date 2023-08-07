import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
// import AddOrHideToken from '@common/modules/dashboard/components/AddOrHideToken'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

// import TokensListLoader from '../Loaders/TokensListLoader'
// import Rewards from '../Rewards'
import TokenItem from './TokenItem'

interface Props {}

const Tokens = ({ tokens, isCurrNetworkBalanceLoading, isCurrNetworkProtocolsLoading }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const sortedTokens = tokens.sort((a, b) => b.balanceUSD - a.balanceUSD)

  const handleGoToDeposit = useCallback(() => navigate(ROUTES.receive), [navigate])
  const handleGoToSend = useCallback(
    (symbol: string) =>
      navigate(ROUTES.send, {
        state: {
          tokenAddressOrSymbol: symbol.toString()
        }
      }),
    [navigate]
  )

  const shouldShowEmptyState = useMemo(
    () => !isCurrNetworkBalanceLoading && !tokens.length && !isCurrNetworkProtocolsLoading,
    [isCurrNetworkBalanceLoading, isCurrNetworkProtocolsLoading, tokens?.length]
  )

  // TODO: Empty state on v2
  const emptyState = (
    <View style={[spacings.phLg, spacings.pvTy, spacings.mbMi, flexboxStyles.center]}>
      <Text style={[spacings.mb, textStyles.center]}>
        {t("Welcome! You don't have any funds on this network.")}
      </Text>
      <Button
        style={{
          // So visually it matches the combined width of the Send and Receive buttons
          width: 210
        }}
        onPress={handleGoToDeposit}
        text={t('Deposit')}
      />
    </View>
  )
  // TODO: Calculate each token height and apply scroll
  return (
    <Wrapper contentContainerStyle={[spacings.ph0, spacings.pv0]}>
      {/* {!!isCurrNetworkBalanceLoading && <TokensListLoader />} */}

      {!!shouldShowEmptyState && emptyState}
      {/* // TODO: Implement rewards token */}
      {/* {!isCurrNetworkBalanceLoading && <Rewards />} */}

      {!isCurrNetworkBalanceLoading &&
        !shouldShowEmptyState &&
        !!sortedTokens.length &&
        sortedTokens.map(
          (
            { address, symbol, img, network, tokenImageUrl, balance, balanceUSD, decimals }: any,
            i: number
          ) => (
            <TokenItem
              key={`token-${address}-${i}`}
              img={img || tokenImageUrl}
              symbol={symbol}
              balance={balance}
              balanceUSD={balanceUSD}
              decimals={decimals}
              address={address}
              network={network}
              onPress={handleGoToSend}
            />
          )
        )}
    </Wrapper>
  )
}

export default Tokens
