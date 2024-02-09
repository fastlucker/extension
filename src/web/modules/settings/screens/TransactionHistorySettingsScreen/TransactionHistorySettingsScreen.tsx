import React, { FC } from 'react'
import { Trans } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { SubmittedAccountOp } from '@ambire-common/controllers/activity/activity'
import { Account } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'

import HistorySettingsPage from '../../components/TransactionHistory/HistorySettingsPage'
import SubmittedTransactionSummary from '../../components/TransactionHistory/SubmittedTransactionSummary'

const AccountOpHistory: FC<{ network?: NetworkDescriptor; account: Account }> = ({
  network,
  account
}) => {
  const { accountPreferences } = useSettingsControllerState()
  const activityState = useActivityControllerState()

  if (!activityState?.accountsOps?.items?.length) {
    return (
      <View
        style={[StyleSheet.absoluteFill, flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}
      >
        <Trans>
          <Text style={text.center}>
            <Text fontSize={16}>{'No transactions history for\n'}</Text>
            <Text fontSize={16} weight="medium">
              {`${accountPreferences?.[account.addr]?.label} (${shortenAddress(account.addr, 10)})`}
            </Text>
            <Text fontSize={16}>{' on '}</Text>
            <Text fontSize={16} weight="medium">
              {network?.name}
            </Text>
          </Text>
        </Trans>
      </View>
    )
  }

  return (
    <>
      {(activityState?.accountsOps?.items || []).map((item: SubmittedAccountOp, i) => (
        <SubmittedTransactionSummary
          key={item.txnId}
          submittedAccountOp={item}
          style={i !== activityState.accountsOps!.items.length - 1 ? spacings.mbLg : {}}
        />
      ))}
    </>
  )
}

const TransactionHistorySettingsScreen = () => {
  return <HistorySettingsPage historyType="transactions" HistoryComponent={AccountOpHistory} />
}

export default TransactionHistorySettingsScreen
