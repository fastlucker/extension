import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { MaterialIcons } from '@expo/vector-icons'
import Blockies from '@modules/common/components/Blockies'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const HIT_SLOP = { bottom: 10, left: 10, right: 10, top: 10 }

const shortenedAddress = (address: any) => `${address.slice(0, 5)}...${address.slice(-3)}`

const walletType = (signerExtra: any) => {
  if (signerExtra && signerExtra.type === 'ledger') return 'Ledger'
  if (signerExtra && signerExtra.type === 'trezor') return 'Trezor'
  return 'Web3'
}

const Accounts = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { accounts, selectedAcc, onSelectAcc, onRemoveAccount } = useAccounts()
  const { network, setNetwork, allNetworks } = useNetwork()
  const sheetNetworks = useBottomSheet()
  const sheetAccounts = useBottomSheet()
  const [logoutWarning, setLogoutWarning] = useState(false)
  const { removeSelectedAccPassword } = useAccountsPasswords()
  const { removePasscode } = usePasscode()
  const { addToast } = useToast()

  const handleChangeNetwork = (chainId: any) => {
    setNetwork(chainId)
    sheetNetworks.closeBottomSheet()
  }

  const handleChangeAccount = (accountId: any) => {
    sheetAccounts.closeBottomSheet()
    onSelectAcc(accountId)
  }

  const handleGoToAddAccount = () => {
    sheetAccounts.closeBottomSheet()
    navigation.navigate('auth-add-account')
  }

  const handleCopyAddress = () => {
    Clipboard.setString(selectedAcc)
    addToast(t('Address copied to clipboard!') as string, { timeout: 2000 })
  }

  const handleGoToSend = () => navigation.navigate('send-tab')

  const handleGoToReceive = () => navigation.navigate('receive')

  const account = accounts.find(({ id }) => id === selectedAcc)
  const { name: networkName, Icon: NetworkIcon } = network || {}

  const renderAccountDetails = (account: any) => {
    const isActive = selectedAcc === account.id
    const onChangeAccount = () => handleChangeAccount(account.id)

    const handleRemoveAccount = async () => {
      setLogoutWarning(false)

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

    return (
      <View
        key={account?.id}
        style={[styles.accItemStyle, spacings.mb, !isActive && styles.inactiveAccount]}
      >
        <TouchableOpacity onPress={onChangeAccount} style={isActive && styles.activeBlockieStyle}>
          <Blockies
            size={16}
            borderRadius={30}
            borderColor={colors.primaryAccentColor}
            seed={account?.id}
          />
        </TouchableOpacity>
        <View style={[flexboxStyles.flex1, spacings.mlTy]}>
          <Text onPress={onChangeAccount}>{account.id}</Text>
          <Text fontSize={14} color={colors.secondaryTextColor}>
            {account.email
              ? `Email/Password account (${account?.email})`
              : `${walletType(account?.signerExtra)} (${shortenedAddress(
                  account?.signer?.address
                )})`}
          </Text>
          {logoutWarning === account.id ? (
            <>
              <Text appearance="danger">
                {t('Are you sure you want to log out from this account?')}{' '}
              </Text>
              <View style={[flexboxStyles.directionRow, flexboxStyles.justifySpaceBetween]}>
                <Text style={textStyles.bold} onPress={handleRemoveAccount}>
                  {t('Yes, log out.')}
                </Text>

                <Text onPress={() => setLogoutWarning(false)}>{t('Cancel')}</Text>
              </View>
            </>
          ) : (
            <Text
              style={[textStyles.bold, textStyles.right]}
              onPress={() => setLogoutWarning(account.id)}
            >
              {t('Log out')}
            </Text>
          )}
        </View>
      </View>
    )
  }

  return (
    <>
      <Panel>
        <Title>{t('Accounts')}</Title>
        <View style={[styles.accItemStyle, spacings.mb]} key={account?.id}>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={sheetAccounts.openBottomSheet}>
            <Blockies seed={account?.id} />
          </TouchableOpacity>
          <View style={[flexboxStyles.flex1, spacings.mlTy]}>
            <TouchableOpacity onPress={sheetAccounts.openBottomSheet} hitSlop={HIT_SLOP}>
              <Text numberOfLines={1} ellipsizeMode="middle">
                {account?.id}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={sheetNetworks.openBottomSheet}>
            <Trans>
              <Text>
                on <NetworkIcon style={styles.networkIcon} />{' '}
                <Text style={textStyles.bold}>{networkName}</Text>
                <Text style={styles.chevron}> 🔽</Text>
              </Text>
            </Trans>
          </TouchableOpacity>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleCopyAddress} style={styles.actionsContainerItem}>
            <MaterialIcons
              size={25}
              name="content-copy"
              color={colors.textColor}
              style={spacings.mbMi}
            />
            <Text fontSize={14} style={textStyles.bold}>
              {t('Copy address')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoToSend} style={styles.actionsContainerItem}>
            <MaterialIcons name="compare-arrows" size={25} color={colors.textColor} />
            <Text fontSize={14} style={textStyles.bold}>
              {t('Send')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionsContainerItem} onPress={handleGoToReceive}>
            <MaterialIcons name="file-download" size={25} color={colors.textColor} />
            <Text fontSize={14} style={textStyles.bold}>
              {t('Receive')}
            </Text>
          </TouchableOpacity>
        </View>
      </Panel>
      <BottomSheet
        id="networks"
        sheetRef={sheetNetworks.sheetRef}
        isOpen={sheetNetworks.isOpen}
        closeBottomSheet={sheetNetworks.closeBottomSheet}
        // Otherwise, with lower max value, on smaller screens the cancel button gets cut off
        maxInitialHeightPercentage={0.8}
      >
        <Title>{t('Change network')}</Title>

        {allNetworks.map(({ name, chainId }) => (
          <Button key={chainId} onPress={() => handleChangeNetwork(chainId)} text={name} />
        ))}
      </BottomSheet>
      <BottomSheet
        id="accounts"
        sheetRef={sheetAccounts.sheetRef}
        isOpen={sheetAccounts.isOpen}
        closeBottomSheet={sheetAccounts.closeBottomSheet}
      >
        <Title>{t('Change account')}</Title>

        {accounts.map(renderAccountDetails)}
        <Button onPress={handleGoToAddAccount} style={spacings.mt} text={t('➕ Add account')} />
      </BottomSheet>
    </>
  )
}

export default Accounts
