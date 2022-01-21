import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import CONFIG from '@config/env'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import { toBundleTxn } from '@modules/common/services/requestToBundleTxn'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
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
        <View style={spacings.mb}>
          <Title>Waiting to be signed (current batch)</Title>
          <Panel>
            {eligibleRequests.map((req) => (
              <TouchableOpacity onPress={() => showSendTxns(null)} activeOpacity={0.8} key={req.id}>
                <TxnPreview
                  network={network.id}
                  account={selectedAcc}
                  disableExpand
                  txn={toBundleTxn(req.txn, selectedAcc)}
                />
              </TouchableOpacity>
            ))}
            <View style={spacings.ptSm}>
              <Button onPress={() => showSendTxns(null)} text="Sign or reject" />
            </View>
          </Panel>
        </View>
      )}

      {!!firstPending && (
        <View style={spacings.mb}>
          <Title>Pending transaction bundle</Title>
          <BundlePreview
            bundle={firstPending}
            hasBottomSpacing
            actions={
              <View style={flexboxStyles.directionRow}>
                <Button
                  type={BUTTON_TYPES.DANGER}
                  onPress={() => cancel(firstPending)}
                  text="Cancel"
                  style={[flexboxStyles.flex1, spacings.mrTy]}
                />
                <Button
                  onPress={() => speedup(firstPending)}
                  text="Speed up"
                  style={flexboxStyles.flex1}
                />
              </View>
            }
          />
        </View>
      )}

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
              // eslint-disable-next-line no-underscore-dangle
              .map((bundle: any) => <BundlePreview key={bundle._id} bundle={bundle} mined />)
        }
      </View>
    </Wrapper>
  )
}

export default TransactionsScreen
