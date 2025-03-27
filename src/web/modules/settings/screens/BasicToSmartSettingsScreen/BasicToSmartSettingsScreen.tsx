import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { getContractImplementation, has7702 } from '@ambire-common/libs/7702/7702'
import { getAuthorizationHash } from '@ambire-common/libs/signMessage/signMessage'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Badge from '@common/components/Badge'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import Authorization7702 from '@web/modules/sign-message/screens/SignMessageScreen/Contents/authorization7702'

import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'

const BasicToSmartSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { accountStates, accounts } = useAccountsControllerState()
  const { account: selectedAccount } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()
  const { theme } = useTheme()
  const { search } = useRoute()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const [hasRefreshedState, setHasRefreshedState] = useState(false)

  useEffect(() => {
    setCurrentSettingsPage('basic-to-smart')
  }, [setCurrentSettingsPage])

  const params = new URLSearchParams(search)
  const accountAddr = params.get('accountAddr')
  const account = useMemo(
    () => accounts.find((acc) => acc.addr === accountAddr),
    [accounts, accountAddr]
  )

  const activate = (chainId: bigint) => {
    const selectedNet = networks.find((net) => net.chainId === chainId)
    if (!selectedNet || !account) return

    const accountState = accountStates[account.addr]
      ? accountStates[account.addr][selectedNet.chainId.toString()]
      : undefined
    if (!accountState) return

    // the same address accross all chains except Pectra where
    // we have a diff address for testing purposese
    const contractAddr = getContractImplementation(chainId)

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: {
        id: new Date().getTime(),
        meta: {
          isSignAction: true,
          chainId: selectedNet.chainId,
          accountAddr: account.addr
        },
        action: {
          kind: 'authorization-7702',
          chainId,
          nonce: accountState.nonce,
          contractAddr,
          message: getAuthorizationHash(chainId, contractAddr, accountState.nonce)
        }
      }
    })
  }

  const getIsSmarterEOA = (chainId: bigint): boolean => {
    const selectedNet = networks.find((net) => net.chainId === chainId)
    if (!selectedNet || !account) return false

    const accountState = accountStates[account.addr]
      ? accountStates[account.addr][selectedNet.chainId.toString()]
      : undefined
    if (!accountState) return false

    return accountState.isSmarterEoa
  }

  const isActivateDisabled = useCallback(
    (net: Network) => {
      if (!has7702(net)) return true
      if (!account) return true

      const accountState = accountStates[account.addr]
        ? accountStates[account.addr][net.chainId.toString()]
        : undefined
      if (!accountState) return true

      return accountState.isSmarterEoa
    },
    [account, accountStates]
  )

  const availableNetworks = useMemo(() => {
    return networks.filter((net) => !isActivateDisabled(net) || has7702(net))
  }, [networks, isActivateDisabled])

  if (!hasRefreshedState && selectedAccount && account && selectedAccount.addr !== account.addr) {
    setHasRefreshedState(true)
    dispatch({
      type: 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_STATE',
      params: {
        addr: account.addr,
        chainIds: availableNetworks.map((n) => n.chainId)
      }
    })
  }

  return (
    <>
      <View style={[flexbox.directionRow, flexbox.alignSelfStart]}>
        <BackButton
          type="secondary"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.secondaryBorder }}
        />
        <SettingsPageHeader
          title="Make your account smarter"
          // @ts-ignore
          style={[spacings.mb0, spacings.mlLg]}
        />
      </View>
      <Authorization7702>
        {account && availableNetworks?.length ? (
          <>
            <Text fontSize={16} style={[spacings.mb, spacings.mt]}>
              {t(
                'While we support multiple networks, only those that have implemented EIP-7702 are listed here. As more networks adopt this upgrade, we will update the list to reflect broader availability.'
              )}
            </Text>
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
            {availableNetworks.map((net) => (
              <View
                key={net.chainId.toString()}
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
                    <NetworkIcon id={net.chainId.toString()} />
                    <Text style={spacings.mlTy}>{net.name}</Text>
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
      </Authorization7702>
    </>
  )
}

export default React.memo(BasicToSmartSettingsScreen)
