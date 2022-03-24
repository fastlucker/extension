import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import CONFIG from '@config/env'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
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
import { useNavigation } from '@react-navigation/native'

const REFRESH_INTVL = 40000

const SignersList = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { selectedAcc, account: selectedAccount, onAddAccount } = useAccounts()
  const { network: selectedNetwork } = useNetwork()
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())
  const navigation = useNavigation()

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
    } else {
      onAddAccount({ ...account, signer: { address: address }, signerExtra: null })
      addToast(
        'This signer is now the default. If it is a hardware wallet, you will have to re-add the account manually to connect it directly, otherwise you will have to add this signer address to your web3 wallet.',
        { timeout: 30000 }
      )

      // The `onAddAccount` method navigates to the Dashboard, so
      // override this behavior and leave user on the current screen.
      navigation.navigate('signers')
    }
  }

  const privList = Object.entries(privileges)
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
        <P type={TEXT_TYPES.DANGER}>
          {t('Error getting authorized signers: {{errMsg}}', { errMsg })}
        </P>
      )}
      {privList}
    </>
  )
}

export default SignersList
