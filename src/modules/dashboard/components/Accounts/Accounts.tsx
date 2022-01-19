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
import ButtonSegment from '@modules/common/components/ButtonSegment'
import Panel from '@modules/common/components/Panel'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
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
  const navigation = useNavigation()
  const { accounts, selectedAcc, onSelectAcc, onRemoveAccount } = useAccounts()
  const { network, setNetwork, allNetworks } = useNetwork()
  const sheetNetworks = useBottomSheet()
  const sheetAccounts = useBottomSheet()
  const [logoutWarning, setLogoutWarning] = useState(false)
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
    addToast(t('Address copied to clipboard!') as string)
  }

  const account = accounts.find(({ id }) => id === selectedAcc)
  const { name: networkName, Icon: NetworkIcon } = network || {}

  const renderAccountDetails = (account) => {
    const isActive = selectedAcc === account.id
    const onChangeAccount = () => handleChangeAccount(account.id)

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
                <Text
                  style={textStyles.bold}
                  onPress={() => {
                    setLogoutWarning(false)
                    onRemoveAccount(account.id)
                  }}
                >
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
        <Title>Accounts</Title>
        <View style={[styles.accItemStyle, spacings.mb]} key={account?.id}>
          <TouchableOpacity onPress={sheetAccounts.openBottomSheet}>
            <Blockies seed={account?.id} />
          </TouchableOpacity>
          <View style={[flexboxStyles.flex1, spacings.mlTy]}>
            <Text onPress={sheetAccounts.openBottomSheet} numberOfLines={1} ellipsizeMode="middle">
              {account?.id}
            </Text>
          </View>
          {/* TODO */}
          {/* <Button onPress={() => onRemoveAccount(selectedAcc.id)} title="Remove" /> */}
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
          <TouchableOpacity onPress={handleCopyAddress} style={flexboxStyles.center}>
            <MaterialIcons
              size={25}
              name="content-copy"
              color={colors.textColor}
              style={spacings.mbTy}
            />
            <Text fontSize={14} style={textStyles.bold}>
              {t('Copy address')}
            </Text>
          </TouchableOpacity>
          <ButtonSegment style={spacings.mb0} text={t('Send')} />
          <ButtonSegment style={spacings.mb0} text={t('Receive')} />
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
