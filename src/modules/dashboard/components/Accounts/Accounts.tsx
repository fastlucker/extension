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
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Accounts = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { accounts, selectedAcc, onSelectAcc, onRemoveAccount } = useAccounts()
  const { network, setNetwork, allNetworks } = useNetwork()
  const sheetNetworks = useBottomSheet()
  const sheetAccounts = useBottomSheet()
  const [logoutWarning, setLogoutWarning] = useState(false)
  const { removeAccPasswordIfItExists } = useAccountsPasswords()
  const { addToast } = useToast()

  const handleChangeNetwork = (chainId) => {
    setNetwork(chainId)
    sheetNetworks.closeBottomSheet()
  }

  const handleChangeAccount = (accountId) => {
    sheetAccounts.closeBottomSheet()
    onSelectAcc(accountId)
  }

  const handleGoToAddAccount = () => {
    sheetAccounts.closeBottomSheet()
    navigation.navigate('auth')
  }

  const handleCopyAddress = () => {
    Clipboard.setString(selectedAcc)
    addToast(t('Address copied to clipboard!') as string, { timeout: 2000 })
  }

  const handleGoToSend = () => navigation.navigate('send-tab')

  const handleGoToReceive = () => navigation.navigate('receive')

  const account = accounts.find(({ id }) => id === selectedAcc)
  const { name: networkName, Icon: NetworkIcon } = network || {}

  const renderAccountDetails = (account) => {
    const isActive = selectedAcc === account.id
    const onChangeAccount = () => handleChangeAccount(account.id)

    const handleRemoveAccount = () => {
      setLogoutWarning(false)

      // Remove account password, because it gets persisted in the iOS Keychain
      // or in the Android Keystore.
      removeAccPasswordIfItExists(account.id)

      onRemoveAccount(account.id)
    }

    return (
      <View
        key={account?.id}
        style={[styles.accItemStyle, spacings.mb, !isActive && styles.inactiveAccount]}
      >
        <TouchableOpacity onPress={onChangeAccount}>
          <Blockies
            size={16}
            borderRadius={30}
            borderWidth={isActive ? 2 : 0}
            borderColor={colors.primaryAccentColor}
            seed={account?.id}
          />
        </TouchableOpacity>
        <View style={[flexboxStyles.flex1, spacings.mlTy]}>
          <Text onPress={onChangeAccount}>{account.id}</Text>
          {logoutWarning === account.id ? (
            <>
              <Text type={TEXT_TYPES.DANGER}>
                {t('Are you sure you want to log out from this account?')}{' '}
              </Text>
              <Text>
                <Text style={textStyles.bold} onPress={handleRemoveAccount}>
                  {t('Yes, log out.')}
                </Text>{' '}
                <Text onPress={() => setLogoutWarning(false)}>{t('Cancel.')}</Text>
              </Text>
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
          <TouchableOpacity onPress={sheetAccounts.openBottomSheet}>
            <Blockies seed={account?.id} />
          </TouchableOpacity>
          <View style={[flexboxStyles.flex1, spacings.mlTy]}>
            <Text onPress={sheetAccounts.openBottomSheet} numberOfLines={1} ellipsizeMode="middle">
              {account?.id}
            </Text>
          </View>
          <View>
            <Trans>
              <Text onPress={sheetNetworks.openBottomSheet}>
                on <NetworkIcon style={styles.networkIcon} />{' '}
                <Text style={textStyles.bold}>{networkName}</Text>
                <Text style={styles.chevron}> 🔽</Text>
              </Text>
            </Trans>
          </View>
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
      <BottomSheet sheetRef={sheetNetworks.sheetRef}>
        <Title>{t('Change network')}</Title>

        {allNetworks.map(({ name, chainId }) => (
          <Button key={chainId} onPress={() => handleChangeNetwork(chainId)} text={name} />
        ))}
      </BottomSheet>
      <BottomSheet sheetRef={sheetAccounts.sheetRef}>
        <Title>{t('Change account')}</Title>

        {accounts.map(renderAccountDetails)}
        <Button onPress={handleGoToAddAccount} style={spacings.mt} text={t('➕ Add account')} />
      </BottomSheet>
    </>
  )
}

export default Accounts
