import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import LogOutIcon from '@assets/svg/LogOutIcon'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Blockies from '@modules/common/components/Blockies'
import Button from '@modules/common/components/Button'
import CopyText from '@modules/common/components/CopyText'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import alert from '@modules/common/services/alert'
import { navigate } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const shortenedAddress = (address: any) => `${address.slice(0, 5)}...${address.slice(-3)}`
const walletType = (signerExtra: any) => {
  if (signerExtra && signerExtra.type === 'ledger') return 'Ledger'
  if (signerExtra && signerExtra.type === 'trezor') return 'Trezor'
  return 'Web3'
}

interface Props {
  closeBottomSheet: (dest?: 'alwaysOpen' | 'default' | undefined) => void
}

const AccountChanger: React.FC<Props> = ({ closeBottomSheet }) => {
  const { t } = useTranslation()
  const { accounts, selectedAcc, onSelectAcc, onRemoveAccount } = useAccounts()
  const { removeSelectedAccPassword } = useBiometricsSign()
  const { removeAppLock } = useAppLock()

  const handleChangeAccount = (accountId: any) => {
    closeBottomSheet()
    onSelectAcc(accountId)
  }

  const handleGoToAddAccount = () => {
    closeBottomSheet()
    navigate('auth-add-account')
  }

  const renderAccount = (account: any) => {
    const isActive = selectedAcc === account.id
    const onChangeAccount = () => handleChangeAccount(account.id)

    const removeAccount = async () => {
      // Remove account password, because it gets persisted in the iOS Keychain
      // or in the Android Keystore.
      await removeSelectedAccPassword(account.id)

      // In case this account is the only one logged in,
      // clean up the app passcode too.
      const isLastAccount = accounts.length === 1
      if (isLastAccount) {
        removeAppLock(account.id)
      }

      onRemoveAccount(account.id)
      closeBottomSheet()
    }

    const handleRemoveAccount = () => {
      return alert(t('Log out from this account?'), undefined, [
        {
          text: t('Log out'),
          onPress: removeAccount,
          style: 'destructive'
        },
        {
          text: t('Cancel'),
          style: 'cancel'
        }
      ])
    }

    return (
      <TouchableOpacity
        onPress={onChangeAccount}
        key={account?.id}
        style={[
          flexboxStyles.directionRow,
          spacings.mbTy,
          spacings.phSm,
          spacings.pvTy,
          isActive && styles.accountContainerActive
        ]}
      >
        <View>
          <Blockies size={8} borderRadius={30} borderColor={colors.valhalla} seed={account?.id} />
        </View>
        <View style={[flexboxStyles.flex1, spacings.mlTy]}>
          <Text type="small" numberOfLines={1} ellipsizeMode="middle">
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
        <View style={[spacings.ml, { justifyContent: 'flex-start', flexDirection: 'row' }]}>
          <CopyText text={account?.id} />
          <NavIconWrapper onPress={handleRemoveAccount} style={spacings.ml}>
            <LogOutIcon />
          </NavIconWrapper>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Title style={textStyles.center} type="small">
        {t('Change account')}
      </Title>
      {accounts.map(renderAccount)}
      <Button onPress={handleGoToAddAccount} style={spacings.mt} text={t('Add Account')} />
    </>
  )
}

export default React.memo(AccountChanger)
