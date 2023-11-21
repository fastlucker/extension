import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, View } from 'react-native'

import { parse } from '@ambire-common/libs/bigintJson/bigintJson'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Pagination from '@common/components/Pagination'
import Select from '@common/components/Select'
import getSelectStyles from '@common/components/Select/styles'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getAccountPfpSource } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatars'
import SettingsPage from '@web/modules/settings/components/SettingsPage'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'
import shortenAddress from '@web/utils/shortenAddress'

import Tabs, { TabId } from './Tabs'

const PLACEHOLDER_CALL = parse(
  '{"to":"0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935","value":{"$bigint":"0"},"data":"0xa9059cbb000000000000000000000000fe89cc7abb2c4183683ab71653c4cdc9b02d44b700000000000000000000000000000000000000000000023da5842a53c43df58c","fromUserRequestId":1700475060014,"fullVisualization":[{"type":"action","content":"Transfer"},{"type":"token","address":"0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935","amount":{"$bigint":"10581911058488020039052"},"symbol":"xWALLET","decimals":18,"readableAmount":"10581.911058488020039052"},{"type":"label","content":"to"},{"type":"address","address":"0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7","name":"0xFe8...4b7"}],"warnings":[{"content":"Unknown address","level":"caution"}]}'
)

type AccountOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const TransactionHistorySettingsScreen = () => {
  const { networks, accountPreferences } = useSettingsControllerState()
  const activityState = useActivityControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { styles: selectStyles } = useTheme(getSelectStyles)

  const [account, setAccount] = useState(
    mainState.accounts.filter((acc) => acc.addr === mainState.selectedAccount)[0]
  )
  const [network, setNetwork] = useState(networks.filter((n) => n.id === 'ethereum')[0])
  const [tab, setTab] = useState<TabId>('transactions')

  const accountsOptions: AccountOption[] = useMemo(() => {
    return mainState.accounts.map((acc) => ({
      value: acc.addr,
      label: <Text weight="medium">{shortenAddress(acc.addr, 20)}</Text>,
      icon: (
        <Image
          style={selectStyles.optionIcon}
          source={getAccountPfpSource(accountPreferences[acc.addr]?.pfp)}
          resizeMode="contain"
        />
      )
    }))
  }, [accountPreferences, mainState.accounts, selectStyles])

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon name={n.id as NetworkIconNameType} />
      })),
    [networks]
  )

  useEffect(() => {
    if (account) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS',
        params: {
          filters: {
            account: account.addr,
            network: network.id
          }
        }
      })
    }
  }, [dispatch, account, network, tab])

  useEffect(() => {
    if (!activityState.isInitialized && account)
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
        params: {
          filters: {
            account: account.addr,
            network: network.id
          }
        }
      })
  }, [dispatch, account, network, activityState.isInitialized])

  const handleSetAccountValue = useCallback(
    (accountOption: AccountOption) => {
      setAccount(mainState.accounts.filter((acc) => acc.addr === accountOption.value)[0])
    },
    [mainState.accounts]
  )

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      setNetwork(networks.filter((net) => net.id === networkOption.value)[0])
    },
    [networks]
  )

  return (
    <SettingsPage currentPage="transaction-history">
      <Tabs selectedTab={tab} setTab={setTab} />
      <View style={[flexboxStyles.directionRow, spacings.mbLg]}>
        <Select
          setValue={handleSetAccountValue}
          style={{ width: 300, ...spacings.mr }}
          options={accountsOptions}
          value={accountsOptions.filter((opt) => opt.value === account.addr)[0]}
        />
        {tab !== 'messages' && (
          <Select
            setValue={handleSetNetworkValue}
            style={{ width: 260 }}
            options={networksOptions}
            value={networksOptions.filter((opt) => opt.value === network.id)[0]}
          />
        )}
      </View>
      <View style={[spacings.mbXl, flexboxStyles.flex1]}>
        {tab === 'transactions' && (
          <TransactionSummary
            key={PLACEHOLDER_CALL.data + PLACEHOLDER_CALL.fromUserRequestId}
            // style={i !== callsToVisualize.length - 1 ? spacings.mbSm : {}}
            style={{}}
            call={PLACEHOLDER_CALL}
            networkId={network.id}
            explorerUrl={network.explorerUrl}
          />
        )}
        {tab === 'messages' && <Text>Signed Messages</Text>}
        {tab === 'cross-chain' && <Text>Cross-Chain Bridge</Text>}
      </View>
      <Pagination style={{ marginLeft: 'auto' }} page={1} setPage={() => null} />
    </SettingsPage>
  )
}

export default TransactionHistorySettingsScreen
