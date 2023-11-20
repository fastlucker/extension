import React, { useState } from 'react'
import { View } from 'react-native'

import { parse } from '@ambire-common/libs/bigintJson/bigintJson'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Pagination from '@common/components/Pagination'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import SettingsPage from '@web/modules/settings/components/SettingsPage'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import Tabs, { TabId } from './Tabs'

const ACCOUNTS_ITEMS = [
  {
    value: 'TODO',
    label: <Text weight="medium">TODO</Text>,
    icon: null
  }
]

const PLACEHOLDER_CALL = parse(
  '{"to":"0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935","value":{"$bigint":"0"},"data":"0xa9059cbb000000000000000000000000fe89cc7abb2c4183683ab71653c4cdc9b02d44b700000000000000000000000000000000000000000000023da5842a53c43df58c","fromUserRequestId":1700475060014,"fullVisualization":[{"type":"action","content":"Transfer"},{"type":"token","address":"0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935","amount":{"$bigint":"10581911058488020039052"},"symbol":"xWALLET","decimals":18,"readableAmount":"10581.911058488020039052"},{"type":"label","content":"to"},{"type":"address","address":"0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7","name":"0xFe8...4b7"}],"warnings":[{"content":"Unknown address","level":"caution"}]}'
)

const TransactionHistorySettingsScreen = () => {
  const { networks } = useSettingsControllerState()
  const [tab, setTab] = useState<TabId>('transactions')
  const network = networks[0]

  const networksOptions = networks.map((n) => ({
    value: n.id,
    label: <Text weight="medium">{n.name}</Text>,
    icon: <NetworkIcon name={n.id as NetworkIconNameType} />
  }))

  return (
    <SettingsPage currentPage="transaction-history">
      <Tabs selectedTab={tab} setTab={setTab} />
      <View style={[flexboxStyles.directionRow, spacings.mbLg]}>
        <Select style={{ width: 300, ...spacings.mr }} options={ACCOUNTS_ITEMS} value="TODO" />
        <Select style={{ width: 260 }} options={networksOptions} value={networks[0].id} />
        <Pagination style={{ marginLeft: 'auto' }} page={1} setPage={() => null} />
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
