import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import CONFIG from '@config/env'
import Button from '@modules/common/components/Button'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import { toBundleTxn } from '@modules/common/services/requestToBundleTxn'
import BundlePreview from '@modules/transactions/components/BundlePreview'
import useTransactions from '@modules/transactions/hooks/useTransactions'

import styles from './styles'

const TransactionsScreen = () => {
  const { data, errMsg, isLoading, speedup, cancel, firstPending, showSendTxns } = useTransactions()
  const { eligibleRequests } = useRequests()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()

  return (
    <Wrapper>
      {!!eligibleRequests.length && (
        <Panel>
          <Title>Waiting to be signed (current batch)</Title>

          <TouchableOpacity onPress={() => showSendTxns(null)}>
            {eligibleRequests.map((req) => (
              <TxnPreview
                key={req.id}
                network={network.id}
                account={selectedAcc}
                disableExpand
                txn={toBundleTxn(req.txn, selectedAcc)}
              />
            ))}
          </TouchableOpacity>
          <View>
            <Button onPress={() => showSendTxns(null)} text="Sign or reject" />
          </View>
        </Panel>
      )}

      {!!firstPending && (
        <Panel>
          <Title>Pending transaction bundle</Title>
          <BundlePreview bundle={firstPending} />
          <View>
            <Button onPress={() => cancel(firstPending)} text="Cancel" />
            <Button onPress={() => speedup(firstPending)} text="Speed up" />
          </View>
        </Panel>
      )}

      <Panel>
        <Title>
          {data && data.txns?.length === 0 ? 'No transactions yet.' : 'Confirmed transactions'}
        </Title>
        <View>
          {!CONFIG.RELAYER_URL && <Text>Unsupported: not currently connected to a relayer.</Text>}
          {errMsg && <Text>Error getting list of transactions: {errMsg}</Text>}
          {isLoading && !data && <ActivityIndicator />}
          {
            // @TODO respect the limit and implement pagination
            !!data &&
              data.txns
                ?.filter((x: any) => x.executed)
                .map((bundle: any) => BundlePreview({ bundle, mined: true }))
          }
        </View>
      </Panel>
    </Wrapper>
  )
}

export default TransactionsScreen
