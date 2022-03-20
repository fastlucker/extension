import { isHexString, toUtf8String } from 'ethers/lib/utils'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import Blockies from '@modules/common/components/Blockies'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Panel from '@modules/common/components/Panel'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRequests from '@modules/common/hooks/useRequests'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
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

const SignScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { connections } = useWalletConnect()
  const { everythingToSign } = useRequests()

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

  const { approve, approveQuickAcc, isLoading, resolve } = useSignMessage(
    {
      sheetRef: sheetRefQickAcc,
      openBottomSheet: openBottomSheetQickAcc,
      closeBottomSheet: closeBottomSheetQickAcc,
      isOpen: isOpenBottomSheetQickAcc
    },
    {
      sheetRef: sheetRefHardwareWallet,
      openBottomSheet: openBottomSheetHardwareWallet,
      closeBottomSheet: closeBottomSheetHardwareWallet,
      isOpen: isOpenBottomSheetHardwareWallet
    }
  )

  const toSign = everythingToSign[0]
  const totalRequests = everythingToSign.length

  const connection = connections?.find(({ uri }: any) => uri === toSign?.wcUri)
  const dApp = connection ? connection?.session?.peerMeta || null : null

  useEffect(() => {
    if (!connection) {
      navigation.goBack()
    }
  }, [connection])

  if (!toSign || !account) return null

  if (toSign && !isHexString(toSign?.txn)) {
    return (
      <Wrapper>
        <Panel>
          <Text fontSize={17} type={TEXT_TYPES.DANGER} style={[textStyles.bold, spacings.mb]}>
            {t('Invalid signing request: .txn has to be a hex string')}
          </Text>
          <Button
            type={BUTTON_TYPES.DANGER}
            text={t('Reject')}
            onPress={() => resolve({ message: 'signature denied' })}
          />
        </Panel>
      </Wrapper>
    )
  }

  return (
    <Wrapper type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW} hasBottomTabNav={false}>
      <Panel>
        <Title>{t('Signing with account')}</Title>
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <Blockies seed={account?.id} />
          <View style={flexboxStyles.flex1}>
            <Text style={[spacings.plTy, textStyles.bold]} fontSize={15}>
              {account.id}
            </Text>
          </View>
        </View>
      </Panel>
      <Panel>
        <Title>{t('Sign message')}</Title>
        {!!dApp && (
          <View style={[flexboxStyles.flex1, spacings.mbTy]}>
            <Text>
              {dApp.icons?.[0] && (
                <>
                  <Image source={{ uri: dApp.icons[0] }} style={styles.image} />{' '}
                </>
              )}
              {t('{{name}} is requesting your signature.', { name: dApp.name })}
            </Text>
          </View>
        )}
        {!dApp && <Text style={spacings.mbTy}>{t('A dApp is requesting your signature.')}</Text>}
        <Text style={spacings.mbSm} color={colors.secondaryTextColor}>
          {totalRequests > 1
            ? t('You have {{number}} more pending requests.', { number: totalRequests - 1 })
            : ''}
        </Text>
        <View style={styles.textarea}>
          <Text fontSize={13} color="#ccc">
            {getMessageAsText(toSign.txn)}
          </Text>
        </View>
        <SignActions
          isLoading={isLoading}
          approve={approve}
          approveQuickAcc={approveQuickAcc}
          resolve={resolve}
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
  )
}

export default SignScreen
