import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import CONFIG from '@config/env'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import accountPresets from '@modules/common/constants/accountPresets'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import useToast from '@modules/common/hooks/useToast'
import { getName } from '@modules/common/services/humanReadableTransactions'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

const REFRESH_INTVL = 40000

const SignersList = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { selectedAcc, account: selectedAccount, onAddAccount } = useAccounts()
  const { network: selectedNetwork } = useNetwork()
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())

  useEffect(() => {
    if (Date.now() - cacheBreak > 30000) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), REFRESH_INTVL)
    return () => clearTimeout(intvl)
  }, [cacheBreak])

  const url = CONFIG.RELAYER_URL
    ? `${CONFIG.RELAYER_URL}/identity/${selectedAcc}/${selectedNetwork?.id}/privileges?cacheBreak=${cacheBreak}`
    : null
  const { data, errMsg, isLoading } = useRelayerData(url)

  const privileges = data ? data.privileges : {}

  const onMakeDefaultBtnClicked = async (account, address, isQuickAccount) => {
    if (isQuickAccount) {
      return addToast(t('To make this signer default, please login with the email') as string, {
        error: true
      })
    }

    onAddAccount({ ...account, signer: { address }, signerExtra: null }, { shouldRedirect: false })
    addToast(
      t(
        'This signer is now the default. If it is a hardware wallet, you will have to re-add the account manually to connect it directly, otherwise you will have to add this signer address to your web3 wallet.'
      ) as string,
      { timeout: 30000 }
    )
  }

  const privList = Object.entries(privileges)
    // Sort the incoming entries, otherwise, they sometime come in different
    // order. And on almost every refresh - the list re-orders. Which is weird.
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([addr, privValue]) => {
      if (!privValue) return null

      const addressName = getName(addr) || null
      const isQuickAcc = addr === accountPresets.quickAccManager
      const privText = isQuickAcc
        ? `Email/password signer (${selectedAccount.email || 'unknown email'})`
        : `${addr} ${addressName && addressName !== addr ? `(${addressName})` : ''}`
      const signerAddress = isQuickAcc
        ? selectedAccount.signer.quickAccManager
        : selectedAccount.signer.address
      const isSelected = signerAddress === addr

      const handleOnMakeDefaultBtnClicked = () =>
        onMakeDefaultBtnClicked(selectedAccount, addr, isQuickAcc)

      return (
        <Text key={addr} style={spacings.mb}>
          {privText}{' '}
          {isSelected ? (
            <Text style={textStyles.bold}>{t('(default signer)')}</Text>
          ) : (
            <Text
              style={[textStyles.bold, { color: colors.primaryAccentColor }]}
              onPress={handleOnMakeDefaultBtnClicked}
            >
              {t('Make default')}
            </Text>
          )}
        </Text>
      )
    })
    .filter((x) => x)

  const showLoading = isLoading && !data

  return (
    <>
      <Title>{t('Authorized signers')}</Title>
      {showLoading && <ActivityIndicator />}
      {!!errMsg && (
        <Text appearance="danger" style={spacings.mbSm}>
          {t('Error getting authorized signers: {{errMsg}}', { errMsg })}
        </Text>
      )}
      {privList}
    </>
  )
}

export default SignersList
