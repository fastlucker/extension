import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, TouchableOpacity, View } from 'react-native'

import LogOutIcon from '@assets/svg/LogOutIcon'
import Blockies from '@modules/common/components/Blockies'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import CopyText from '@modules/common/components/CopyText'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import { NetworkType } from '@modules/common/constants/networks'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePasscode from '@modules/common/hooks/usePasscode'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const shortenedAddress = (address: any) => `${address.slice(0, 5)}...${address.slice(-3)}`
const walletType = (signerExtra: any) => {
  if (signerExtra && signerExtra.type === 'ledger') return 'Ledger'
  if (signerExtra && signerExtra.type === 'trezor') return 'Trezor'
  return 'Web3'
}

const Switcher: React.FC = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { sheetRef, isOpen, closeBottomSheet, openBottomSheet } = useBottomSheet()
  const { network, setNetwork, allNetworks } = useNetwork()
  const { accounts, selectedAcc, onSelectAcc, onRemoveAccount } = useAccounts()
  const { removeSelectedAccPassword } = useAccountsPasswords()
  const { removePasscode } = usePasscode()

  const handleChangeNetwork = (chainId: any) => {
    setNetwork(chainId)
    closeBottomSheet()
  }

  const handleChangeAccount = (accountId: any) => {
    closeBottomSheet()
    onSelectAcc(accountId)
  }

  const handleGoToAddAccount = () => {
    closeBottomSheet()
    navigation.navigate('auth-add-account')
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
        removePasscode(account.id)
      }

      onRemoveAccount(account.id)
    }

    const handleRemoveAccount = () =>
      Alert.alert(t('Log out from this account?'), undefined, [
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

    return (
      <TouchableOpacity
        onPress={onChangeAccount}
        key={account?.id}
        style={[flexboxStyles.directionRow, spacings.mb, isActive && styles.accountContainerActive]}
      >
        <View>
          <Blockies size={8} borderRadius={30} borderColor={colors.valhalla} seed={account?.id} />
        </View>
        <View style={[flexboxStyles.flex1, spacings.mlTy]}>
          <Text type="small" numberOfLines={1} ellipsizeMode="middle">
            {account.id}
          </Text>
          <Text type="info" color={colors.titan_05}>
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

  const renderNetwork = ({ name, Icon, chainId }: NetworkType) => {
    const isActive = chainId === network?.chainId

    return (
      <TouchableOpacity
        key={chainId}
        onPress={() => handleChangeNetwork(chainId)}
        style={[styles.networkBtnContainer, isActive && styles.networkBtnContainerActive]}
      >
        <Text
          weight="regular"
          color={isActive ? colors.titan : colors.titan_05}
          style={[flexboxStyles.flex1, textStyles.center]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <View style={styles.networkBtnIcon}>
          <Icon />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <TouchableOpacity style={styles.switcherContainer} onPress={openBottomSheet}>
        <Blockies borderRadius={13} seed={selectedAcc} />

        <View style={[flexboxStyles.flex1, spacings.mhTy]}>
          <Text weight="regular">{network?.name}</Text>
          <Text color={colors.baileyBells} fontSize={12} numberOfLines={1} ellipsizeMode="middle">
            {selectedAcc}
          </Text>
        </View>

        <CopyText text={selectedAcc} />
      </TouchableOpacity>
      <BottomSheet
        id="header-switcher"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
        displayCancel={false}
      >
        <Title style={textStyles.center} type="small">
          {t('Change network')}
        </Title>
        {allNetworks.map(renderNetwork)}

        <Title style={[textStyles.center, spacings.mt]} type="small">
          {t('Change account')}
        </Title>
        {accounts.map(renderAccount)}
        <Button onPress={handleGoToAddAccount} style={spacings.mt} text={t('Add account')} />
      </BottomSheet>
    </>
  )
}

export default Switcher
