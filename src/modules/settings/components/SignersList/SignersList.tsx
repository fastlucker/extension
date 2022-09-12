import accountPresets from 'ambire-common/src/constants/accountPresets'
import useCacheBreak from 'ambire-common/src/hooks/useCacheBreak'
import { getName } from 'ambire-common/src/services/humanReadableTransactions'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CONFIG from '@config/env'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import useToast from '@modules/common/hooks/useToast'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

const SignersList = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { selectedAcc, account: selectedAccount, onAddAccount } = useAccounts()
  const { constants, isLoading: areConstantsLoading } = useConstants()
  const { network: selectedNetwork } = useNetwork()
  const { cacheBreak } = useCacheBreak({
    breakPoint: 30000,
    refreshInterval: 40000
  })

  const url = CONFIG.RELAYER_URL
    ? `${CONFIG.RELAYER_URL}/identity/${selectedAcc}/${selectedNetwork?.id}/privileges?cacheBreak=${cacheBreak}`
    : null
  const { data, errMsg, isLoading } = useRelayerData({ url })

  const privileges = data ? data.privileges : {}
  const showLoading = isLoading && !data

  useEffect(() => {
    triggerLayoutAnimation()
  }, [showLoading, selectedNetwork, selectedAcc])

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

      const addressName = !areConstantsLoading && (getName(constants?.humanizerInfo, addr) || null)
      const isQuickAcc = addr === accountPresets.quickAccManager
      const privText = isQuickAcc
        ? `Email/password signer (${selectedAccount?.email || 'unknown email'})`
        : `${addr} ${addressName && addressName !== addr ? `(${addressName})` : ''}`
      const signerAddress = isQuickAcc
        ? selectedAccount?.signer?.quickAccManager
        : selectedAccount?.signer?.address
      const isSelected = signerAddress === addr

      const handleOnMakeDefaultBtnClicked = () =>
        onMakeDefaultBtnClicked(selectedAccount, addr, isQuickAcc)

      return (
        <Text type="small" key={addr} style={spacings.mb}>
          {privText}{' '}
          {isSelected ? (
            <Text type="small">{t('(default signer)')}</Text>
          ) : (
            <Text
              type="small"
              weight="medium"
              style={{ color: colors.turquoise }}
              onPress={handleOnMakeDefaultBtnClicked}
            >
              {t('Make default')}
            </Text>
          )}
        </Text>
      )
    })
    .filter((x) => x)

  return (
    <>
      <Title hasBottomSpacing={false} style={[textStyles.center, spacings.mbSm]}>
        {t('Authorized signers')}
      </Title>
      {showLoading && (
        <View style={[flexboxStyles.center, spacings.pv]}>
          <Spinner />
        </View>
      )}

      {!!errMsg && (
        <Text type="small" appearance="danger" style={spacings.mbSm}>
          {t('Error getting authorized signers: {{errMsg}}', { errMsg })}
        </Text>
      )}
      {privList}
    </>
  )
}

export default SignersList
