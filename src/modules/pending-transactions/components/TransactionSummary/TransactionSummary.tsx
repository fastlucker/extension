import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import useRequests from '@modules/common/hooks/useRequests'

const REJECT_MSG = 'Ambire user rejected the request'

const TransactionSummary = ({ bundle, estimation }: any) => {
  const { t } = useTranslation()
  const { resolveMany } = useRequests()

  return (
    <Panel>
      <Title>{t('Transaction summary')}</Title>
      <View>
        {bundle.txns.map((txn: any, i: number) => {
          const isFirstFailing = estimation && !estimation.success && estimation.firstFailing === i
          // we need to re-render twice per minute cause of DEX deadlines
          const min = Math.floor(Date.now() / 30000)
          return (
            <TxnPreview
              key={[...txn, i].join(':')}
              // pasing an unused property to make it update
              minute={min}
              onDismiss={
                bundle.requestIds &&
                (() => resolveMany([bundle.requestIds[i]], { message: REJECT_MSG }))
              }
              txn={txn}
              network={bundle.network}
              account={bundle.identity}
              isFirstFailing={isFirstFailing}
            />
          )
        })}
        <View>
          <Text>
            {bundle.requestIds
              ? 'DEGEN TIP: You can sign multiple transactions at once. Add more transactions to this batch by interacting with a connected dApp right now.'
              : 'NOTE: You are currently replacing a pending transaction.'}
          </Text>
        </View>
      </View>
    </Panel>
  )
}

export default TransactionSummary
