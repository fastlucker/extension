import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

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
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import Authorization7702 from '@web/modules/sign-message/screens/SignMessageScreen/Contents/authorization7702'

import { ZERO_ADDRESS } from '@ambire-common/services/socket/constants'
import Spinner from '@common/components/Spinner'
import useDelegationControllerState from '@web/hooks/useDelegationControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'

const DelegationsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { accountStates, accounts } = useAccountsControllerState()
  const { account: selectedAccount } = useSelectedAccountControllerState()
  const { delegations, delegationNetworks } = useDelegationControllerState()

  const { networks } = useNetworksControllerState()
  const { theme } = useTheme()
  const { search } = useRoute()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  useEffect(() => {
    setCurrentSettingsPage('basic-to-smart')
  }, [setCurrentSettingsPage])

  const params = new URLSearchParams(search)
  const accountAddr = params.get('accountAddr')
  const account = useMemo(
    () => accounts.find((acc) => acc.addr === accountAddr),
    [accounts, accountAddr]
  )

  // if the account is not the selected one, select it so it could do txns
  useEffect(() => {
    if (!selectedAccount || !account) return
    if (selectedAccount.addr === account.addr) return

    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: {
        accountAddr: account.addr
      }
    })
  }, [selectedAccount, account, dispatch])

  const delegate = (chainId: bigint) => {
    const selectedNet = networks.find((net) => net.chainId === chainId)
    if (!selectedNet || !delegations || !selectedAccount) return

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: {
        id: new Date().getTime(),
        meta: {
          isSignAction: true,
          chainId: selectedNet.chainId,
          accountAddr: selectedAccount.addr,
          setDelegation: delegations[selectedNet.chainId.toString()]
        },
        action: {
          kind: 'calls',
          calls: [
            {
              to: ZERO_ADDRESS,
              data: '0x',
              value: BigInt(0)
            }
          ]
        }
      }
    })
  }

  if (!delegations) {
    return (
      <View style={[spacings.pv, spacings.ph, flexbox.center, flexbox.flex1]}>
        <Spinner />
      </View>
    )
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
        {account && delegationNetworks?.length ? (
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
            {delegationNetworks.map((net) => (
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
                    {delegations[net.chainId.toString()] ? (
                      <Badge type="success" text={t('activated')} />
                    ) : (
                      <Badge type="default" text={t('inactive')} />
                    )}
                  </View>
                </View>
                <View style={[flexbox.flex1, flexbox.alignEnd]}>
                  <View style={[flexbox.directionRow]}>
                    <Button
                      type={
                        !accountStates[account.addr][net.chainId.toString()]?.isSmarterEoa
                          ? 'primary'
                          : 'danger'
                      }
                      size="tiny"
                      style={[spacings.mb0, { minWidth: '95px' }]}
                      onPress={() => delegate(net.chainId)}
                      text={
                        !accountStates[account.addr][net.chainId.toString()]?.isSmarterEoa
                          ? t('Activate')
                          : t('Deactivate')
                      }
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

export default React.memo(DelegationsScreen)
