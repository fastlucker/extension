import React, { useState } from 'react'
import { ActivityIndicator, Image, Linking, View } from 'react-native'

import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { Row } from '@modules/common/components/Table'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import AddToken from '@modules/dashboard/components/AddToken'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { areProtocolsLoading, protocols, tokens } = usePortfolio()
  const { selectedAcc } = useAccounts()
  const { network: selectedNetwork } = useNetwork()
  const [failedImg, setFailedImg] = useState<string[]>([])

  const sortedTokens = tokens.sort((a, b) => b.balanceUSD - a.balanceUSD)
  const otherProtocols = protocols.filter(({ label }) => label !== 'Tokens')

  const handleGoToDeposit = () => navigation.navigate('receive')
  const handleGoToSend = (symbol) => navigation.navigate('send', { symbol: symbol.toString() })
  const handleGoToBlockExplorer = () =>
    Linking.openURL(`${selectedNetwork?.explorerUrl}/address/${selectedAcc}`)

  const tokenItem = (index, img, symbol, balance, balanceUSD, address, send = false) => (
    <Row index={index} key={`token-${address}-${index}`}>
      <View style={spacings.pr}>
        {failedImg.includes(img) ? (
          <Text fontSize={34}>🪙</Text>
        ) : (
          <Image
            style={styles.img}
            source={{ uri: img }}
            onError={() => setFailedImg((failed) => [...failed, img])}
          />
        )}
      </View>

      <View style={[spacings.ph, styles.rowItemMain]}>
        <Text style={styles.balance} numberOfLines={1}>
          {balance}
        </Text>
        <Text style={styles.balanceFiat}>
          <Text style={[styles.balanceFiat, textStyles.highlightSecondary]}>$</Text>{' '}
          {balanceUSD.toFixed(2)}
        </Text>
      </View>

      <View style={spacings.pl}>
        <Text
          style={[styles.symbol, textStyles.highlightPrimary]}
          onPress={() => handleGoToSend(symbol)}
        >
          {symbol}
        </Text>
      </View>
    </Row>
  )

  const emptyState = (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        {t("Welcome! You don't have any funds on this account.")}
      </Text>
      <Button onPress={handleGoToDeposit} text={t('💸 Deposit')} />
    </View>
  )

  return (
    <>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>{t('Tokens')}</Title>
        <AddToken />
      </View>

      {areProtocolsLoading ? (
        <ActivityIndicator />
      ) : sortedTokens.length ? (
        sortedTokens.map(({ address, symbol, tokenImageUrl, balance, balanceUSD }, i) =>
          tokenItem(i, tokenImageUrl, symbol, balance, balanceUSD, address, true)
        )
      ) : (
        emptyState
      )}

      {!!otherProtocols.length &&
        otherProtocols.map(({ label, assets }, i) => (
          <View key={`category-${i}`}>
            <View style={styles.header}>
              <Title style={styles.headerTitle}>{label}</Title>
            </View>
            {assets.map(({ category, symbol, tokenImageUrl, balance, balanceUSD, address }, i) =>
              tokenItem(
                i,
                tokenImageUrl,
                symbol,
                balance,
                balanceUSD,
                address,
                category !== 'claimable'
              )
            )}
          </View>
        ))}

      <View style={styles.footer}>
        <View style={flexboxStyles.directionRow}>
          <Text>ℹ️</Text>
          <Trans>
            <Text style={styles.infoText}>
              If you don't see a specific token that you own, please check the{' '}
              <Text onPress={handleGoToBlockExplorer} style={textStyles.bold}>
                Block Explorer
              </Text>
            </Text>
          </Trans>
        </View>
        {!areProtocolsLoading && !!protocols.length && (
          <Text style={styles.subInfoText}>{t('Powered by Velcro')}</Text>
        )}
      </View>
    </>
  )
}

export default Balances
