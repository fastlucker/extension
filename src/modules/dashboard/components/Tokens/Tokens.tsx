import React, { useState } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'

import SendIcon from '@assets/svg/SendIcon'
import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Title from '@modules/common/components/Title'
import TokenIcon from '@modules/common/components/TokenIcon'
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
  const navigation: any = useNavigation()
  const { areProtocolsLoading, isBalanceLoading, protocols, tokens } = usePortfolio()
  const { selectedAcc } = useAccounts()
  const { network: selectedNetwork } = useNetwork()
  const [failedImg, setFailedImg] = useState<string[]>([])

  const isLoading = isBalanceLoading || areProtocolsLoading

  const sortedTokens = tokens.sort((a, b) => b.balanceUSD - a.balanceUSD)
  const otherProtocols = protocols.filter(({ label }) => label !== 'Tokens')

  const handleGoToDeposit = () => navigation.navigate('receive')
  const handleGoToSend = (symbol: string) =>
    navigation.navigate('send', { tokenAddressOrSymbol: symbol.toString() })
  const handleGoToBlockExplorer = () =>
    Linking.openURL(`${selectedNetwork?.explorerUrl}/address/${selectedAcc}`)

  const tokenItem = (index, img, symbol, balance, balanceUSD, address, send = false) => (
    <View key={`token-${address}-${index}`} style={styles.tokenItemContainer}>
      <View style={spacings.prSm}>
        {failedImg.includes(img) ? (
          <Text fontSize={34}>🪙</Text>
        ) : (
          <TokenIcon
            source={{ uri: img }}
            onError={() => setFailedImg((failed) => [...failed, img])}
          />
        )}
      </View>

      <Text fontSize={16} style={spacings.prSm}>
        {symbol}
      </Text>

      <View style={styles.tokenValue}>
        <Text fontSize={16} numberOfLines={1}>
          {balance}
        </Text>
        <Text style={textStyles.highlightSecondary}>${balanceUSD.toFixed(2)}</Text>
      </View>

      <View style={spacings.plSm}>
        <TouchableOpacity
          onPress={() => handleGoToSend(symbol)}
          hitSlop={{ bottom: 10, top: 10, left: 5, right: 5 }}
          style={styles.sendContainer}
        >
          <SendIcon />
        </TouchableOpacity>
      </View>
    </View>
  )

  const emptyState = (
    <View style={[spacings.phLg, spacings.mbSm]}>
      <Text style={[spacings.mbSm, textStyles.center]}>
        {t("Welcome! You don't have any funds on this account.")}
      </Text>
      <Button onPress={handleGoToDeposit} text={t('Deposit')} />
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
        sortedTokens.map(({ address, symbol, tokenImageUrl, balance, balanceUSD }, i) =>
          tokenItem(i, tokenImageUrl, symbol, balance, balanceUSD, address, true)
        )}

      {!!otherProtocols.length &&
        otherProtocols.map(({ label, assets }, i) => (
          <View key={`category-${i}`}>
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

export default Balances
