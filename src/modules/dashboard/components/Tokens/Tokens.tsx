import React, { useCallback } from 'react'
import { Linking, View } from 'react-native'

import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import AddToken from '@modules/dashboard/components/AddToken'
import { useNavigation } from '@react-navigation/native'

import TokenItem from './TokenItem'

const Tokens = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isCurrNetworkProtocolsLoading, isCurrNetworkBalanceLoading, protocols, tokens } =
    usePortfolio()
  const { selectedAcc } = useAccounts()
  const { network: selectedNetwork } = useNetwork()

  const isLoading = isCurrNetworkBalanceLoading || isCurrNetworkProtocolsLoading

  const sortedTokens = tokens.sort((a, b) => b.balanceUSD - a.balanceUSD)
  const otherProtocols = protocols.filter(({ label }) => label !== 'Tokens')

  const handleGoToDeposit = () => navigation.navigate('receive')
  const handleGoToSend = useCallback(
    (symbol: string) => navigation.navigate('send', { tokenAddressOrSymbol: symbol.toString() }),
    []
  )
  const handleGoToBlockExplorer = () =>
    Linking.openURL(`${selectedNetwork?.explorerUrl}/address/${selectedAcc}`)

  const emptyState = (
    <View style={[spacings.phLg, spacings.mbSm, flexboxStyles.center]}>
      <Text style={[spacings.mbSm, textStyles.center]}>
        {t("Welcome! You don't have any funds on this account.")}
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

  return (
    <>
      {isLoading && (
        <View style={[flexboxStyles.center, spacings.pbLg]}>
          <Spinner />
        </View>
      )}

      {!isLoading && !sortedTokens.length && emptyState}

      {!isLoading &&
        !!sortedTokens.length &&
        sortedTokens.map(
          (
            { address, symbol, img, tokenImageUrl, balance, balanceUSD, decimals }: any,
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
              networkId={selectedNetwork?.id}
              onPress={handleGoToSend}
            />
          )
        )}

      {!!otherProtocols.length &&
        otherProtocols.map(({ label, assets }, i) => (
          <View key={`category-${i}`}>
            {assets.map(
              (
                { symbol, img, tokenImageUrl, balance, balanceUSD, decimals, address }: any,
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
                  networkId={selectedNetwork?.id}
                  onPress={handleGoToSend}
                />
              )
            )}
          </View>
        ))}

      <AddToken />

      <TextWarning appearance="info" style={spacings.mb0}>
        <Trans>
          <Text type="caption">
            If you don't see a specific token that you own, please check the{' '}
            <Text weight="medium" type="caption" onPress={handleGoToBlockExplorer}>
              Block Explorer
            </Text>
          </Text>
        </Trans>
      </TextWarning>
    </>
  )
}

export default Tokens
