import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { EIP_7702_AMBIRE_ACCOUNT } from '@ambire-common/consts/deploy'
import { Account } from '@ambire-common/interfaces/account'
import { Network } from '@ambire-common/interfaces/network'
import { canBecomeSmarter, hasAuthorized7702 } from '@ambire-common/libs/account/account'
import { getEip7702Authorization } from '@ambire-common/libs/signMessage/signMessage'
import Alert from '@common/components/Alert'
import Badge from '@common/components/Badge'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import AccountOption from '@common/components/Option/AccountOption'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import useWindowSize from '@common/hooks/useWindowSize'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'

const BasicToSmartSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { account: accountData } = useSelectedAccountControllerState()
  const { accountStates, accounts, authorizations } = useAccountsControllerState()
  const { networks } = useNetworksControllerState()
  const { keys } = useKeystoreControllerState()
  const { maxWidthSize } = useWindowSize()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  useEffect(() => {
    setCurrentSettingsPage('basic-to-smart')
  }, [setCurrentSettingsPage])

  const getAccKeys = useCallback(
    (acc: Account | undefined) => {
      return keys.filter((key) => acc?.associatedKeys.includes(key.addr))
    },
    [keys]
  )

  const canSelectedAccountBeTransformedToSmart = useMemo(() => {
    if (!accountData) return false

    return canBecomeSmarter(accountData, getAccKeys(accountData))
  }, [accountData, getAccKeys])

  const [account, setAccount] = useState<Account | undefined>(
    canSelectedAccountBeTransformedToSmart
      ? (accountData as Account)
      : accounts.find((acc) => canBecomeSmarter(acc, getAccKeys(acc)))
  )

  const accountsOptions: SelectValue[] = useMemo(() => {
    return accounts
      .filter((acc) => canBecomeSmarter(acc, getAccKeys(acc)))
      .map((acc) => ({
        value: acc.addr,
        label: <AccountOption acc={acc} />,
        extraSearchProps: { accountLabel: acc.preferences.label }
      }))
  }, [accounts, getAccKeys])

  const handleSetAccountValue = useCallback(
    (accountOption: SelectValue) => {
      setAccount(accounts.filter((acc) => acc.addr === accountOption.value)[0])
    },
    [accounts]
  )

  const activate = (chainId: bigint) => {
    const selectedNet = networks.find((net) => net.chainId === chainId)
    if (!selectedNet || !account) return

    const accountState = accountStates[account.addr]
      ? accountStates[account.addr][selectedNet.id]
      : undefined
    if (!accountState) return

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: {
        id: new Date().getTime(),
        meta: {
          isSignAction: true,
          networkId: selectedNet.id,
          accountAddr: account.addr
        },
        action: {
          kind: 'authorization-7702',
          chainId,
          nonce: accountState.nonce,
          contractAddr: EIP_7702_AMBIRE_ACCOUNT,
          message: getEip7702Authorization(chainId, EIP_7702_AMBIRE_ACCOUNT, accountState.nonce)
        }
      }
    })
  }

  const getIsSmarterEOA = (chainId: bigint): boolean => {
    const selectedNet = networks.find((net) => net.chainId === chainId)
    if (!selectedNet || !account) return false

    const accountState = accountStates[account.addr]
      ? accountStates[account.addr][selectedNet.id]
      : undefined
    if (!accountState) return false

    return accountState.isSmarterEoa
  }

  const isActivateDisabled = useCallback(
    (net: Network) => {
      if (!net.has7702) return true
      if (!account) return true

      const accountState = accountStates[account.addr]
        ? accountStates[account.addr][net.id]
        : undefined
      if (!accountState) return true

      return hasAuthorized7702(account, accountState.nonce, net, authorizations)
    },
    [account, accountStates, authorizations]
  )

  return (
    <>
      <SettingsPageHeader title="Basic to Smart" />
      {accountsOptions.length && account ? (
        <>
          <View style={[flexbox.directionRow, spacings.mbLg]}>
            <Select
              setValue={handleSetAccountValue}
              containerStyle={{ width: maxWidthSize('xl') ? 420 : 340, ...spacings.mr }}
              options={accountsOptions}
              value={accountsOptions.filter((opt) => opt.value === account.addr)[0]}
            />
          </View>
          <View
            style={[
              {
                borderBottomWidth: 2,
                borderBottomColor: colors.lightAzureBlue
              },
              flexbox.directionRow,
              spacings.mb
            ]}
          >
            <View style={[flexbox.flex1]}>
              <Text>Network</Text>
            </View>
            <View style={[flexbox.flex1, flexbox.alignCenter]}>
              <Text>Status</Text>
            </View>
            <View style={[flexbox.flex1, flexbox.alignEnd]}>
              <Text>Action</Text>
            </View>
          </View>
          {networks.map((net) => (
            <View
              key={net.id}
              style={[
                {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.lightAzureBlue
                },
                flexbox.directionRow,
                flexbox.alignCenter,
                spacings.pb,
                spacings.mb
              ]}
            >
              <View style={[flexbox.flex1]}>
                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <NetworkIcon id={net.id} style={spacings.mrTy} />
                  <Text>{net.name}</Text>
                </View>
              </View>
              <View style={[flexbox.flex1, flexbox.alignCenter]}>
                <View style={[flexbox.directionRow]}>
                  {getIsSmarterEOA(net.chainId) ? (
                    <Badge type="success" text={t('activated')} />
                  ) : (
                    <Badge type="default" text={t('deactivated')} />
                  )}
                </View>
              </View>
              <View style={[flexbox.flex1, flexbox.alignEnd]}>
                <View style={[flexbox.directionRow]}>
                  <Button
                    size="small"
                    disabled={isActivateDisabled(net)}
                    style={[spacings.mb0]}
                    onPress={() => activate(net.chainId)}
                    text="Activate"
                  />
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View>
          <Alert type="info" size="md">
            <Text fontSize={16} appearance="infoText">
              {t(
                'No accounts available. Turning Basic Accounts into Smart is only available for hot wallets (wallets whose key is directly imported into the extension) as none of the hardware wallets support this functionality, yet. To proceed, please import a Basic Account through private key import'
              )}
            </Text>
          </Alert>
        </View>
      )}
    </>
  )
}

export default React.memo(BasicToSmartSettingsScreen)
