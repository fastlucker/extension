import { toUtf8String } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import CONFIG from '@config/env'
import Blockies from '@modules/common/components/Blockies'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useDisableHardwareBackPress from '@modules/common/hooks/useDisableHardwareBackPress'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import { getWallet } from '@modules/common/services/getWallet/getWallet'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import SignActions from '@modules/sign-message/components/SignActions'
import useSignMessage from '@modules/sign-message/hooks/useSignMessage'

import styles from './styles'

function getMessageAsText(msg: any) {
  try {
    return toUtf8String(msg)
  } catch (_) {
    return msg
  }
}

const relayerURL = CONFIG.RELAYER_URL

const shortenedAddress = (address: any) => `${address.slice(0, 5)}...${address.slice(-3)}`
const walletType = (signerExtra: any) => {
  if (signerExtra && signerExtra.type === 'ledger') return 'Ledger'
  if (signerExtra && signerExtra.type === 'trezor') return 'Trezor'
  return 'Web3'
}

const SignScreen = ({ navigation }: any) => {
  const [confirmationType, setConfirmationType] = useState<'email' | 'otp' | null>(null)

  const { t } = useTranslation()
  const { account } = useAccounts()
  const { addToast } = useToast()
  const { connections } = useWalletConnect()
  const { everythingToSign, resolveMany } = useRequests()

  const resolve = (outcome: any) => resolveMany([everythingToSign[0].id], outcome)

  useDisableHardwareBackPress()

  const {
    sheetRef: sheetRefQickAcc,
    openBottomSheet: openBottomSheetQickAcc,
    closeBottomSheet: closeBottomSheetQickAcc,
    isOpen: isOpenBottomSheetQickAcc
  } = useBottomSheet()

  const {
    sheetRef: sheetRefHardwareWallet,
    openBottomSheet: openBottomSheetHardwareWallet,
    closeBottomSheet: closeBottomSheetHardwareWallet,
    isOpen: isOpenBottomSheetHardwareWallet
  } = useBottomSheet()

  const getHardwareWallet = (device: any) => {
    if (!isOpenBottomSheetHardwareWallet && !device) {
      openBottomSheetHardwareWallet()
      return
    }

    // if quick account, wallet = await fromEncryptedBackup
    // and just pass the signature as secondSig to signMsgHash
    const wallet = getWallet(
      {
        signer: account.signer,
        signerExtra: account.signerExtra,
        chainId: 1 // does not matter
      },
      device
    )

    return wallet
  }

  const onConfirmationCodeRequired = (confCodeRequired: 'email' | 'otp' | null) => {
    setConfirmationType(confCodeRequired)
    openBottomSheetQickAcc()
  }

  const onLastMessageSign = () => {
    navigation.navigate('dashboard')
  }

  const {
    approve,
    approveQuickAcc,
    toSign,
    isLoading,
    hasPrivileges,
    hasProviderError,
    typeDataErr,
    isDeployed,
    dataV4
  } = useSignMessage({
    account,
    everythingToSign,
    relayerURL,
    addToast,
    resolve,
    onConfirmationCodeRequired,
    onLastMessageSign,
    getHardwareWallet
  })

  const connection = connections?.find(({ uri }: any) => uri === toSign?.wcUri)
  const dApp = connection ? connection?.session?.peerMeta || null : null

  useEffect(() => {
    if (!connection) {
      navigation.goBack()
    }
  }, [connection, navigation])

  if (!toSign || !account) return null

  if (typeDataErr) {
    return (
      <Wrapper>
        <Panel>
          <Text fontSize={17} appearance="danger" style={spacings.mb}>
            {t('Invalid signing request: {{typeDataErr}}', { typeDataErr })}
          </Text>
          <Button
            type="danger"
            text={t('Reject')}
            onPress={() => resolve({ message: 'signature denied' })}
          />
        </Panel>
      </Wrapper>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW} extraHeight={180}>
        <Title style={[textStyles.center, spacings.mbTy]} hasBottomSpacing={false}>
          {t('Signing with account')}
        </Title>
        <Panel type="filled" contentContainerStyle={[spacings.pvTy, spacings.phTy]}>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            <Blockies seed={account?.id} />
            <View style={[flexboxStyles.flex1, spacings.plTy]}>
              <Text style={spacings.mbMi} numberOfLines={1} ellipsizeMode="middle" fontSize={12}>
                {account.id}
              </Text>
              <Text type="info" color={colors.titan_50}>
                {account.email
                  ? t('Email/Password account ({{email}})', { email: account?.email })
                  : `${walletType(account?.signerExtra)} (${shortenedAddress(
                      account?.signer?.address
                    )})`}
              </Text>
            </View>
          </View>
        </Panel>
        <Panel>
          <Title type="small">{t('Sign message')}</Title>
          {!!dApp && (
            <View style={[flexboxStyles.flex1, spacings.mbTy, flexboxStyles.directionRow]}>
              {!!dApp.icons?.[0] && <Image source={{ uri: dApp.icons[0] }} style={styles.image} />}
              <Text style={flexboxStyles.flex1} fontSize={14}>
                {t('{{name}} is requesting your signature.', { name: dApp.name })}
              </Text>
            </View>
          )}
          {!dApp && <Text style={spacings.mbTy}>{t('A dApp is requesting your signature.')}</Text>}
          <Text style={spacings.mbTy} color={colors.titan_50} fontSize={14}>
            {everythingToSign?.length > 1
              ? t('You have {{number}} more pending requests.', {
                  number: (everythingToSign?.length || 0) - 1
                })
              : ''}
          </Text>
          <View style={styles.textarea}>
            <Text fontSize={12}>
              {dataV4 ? JSON.stringify(dataV4, '\n', ' ') : getMessageAsText(toSign.txn)}
            </Text>
          </View>
          <SignActions
            isLoading={isLoading}
            approve={approve}
            approveQuickAcc={approveQuickAcc}
            confirmationType={confirmationType}
            resolve={resolve}
            hasPrivileges={hasPrivileges}
            isDeployed={isDeployed}
            hasProviderError={hasProviderError}
            quickAccBottomSheet={{
              sheetRef: sheetRefQickAcc,
              openBottomSheet: openBottomSheetQickAcc,
              closeBottomSheet: closeBottomSheetQickAcc,
              isOpen: isOpenBottomSheetQickAcc
            }}
            hardwareWalletBottomSheet={{
              sheetRef: sheetRefHardwareWallet,
              openBottomSheet: openBottomSheetHardwareWallet,
              closeBottomSheet: closeBottomSheetHardwareWallet,
              isOpen: isOpenBottomSheetHardwareWallet
            }}
          />
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SignScreen
