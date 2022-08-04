import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import useRequests from '@modules/common/hooks/useRequests'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

const REJECT_MSG = 'Ambire user rejected the request'

const TransactionSummary = ({ bundle, estimation }: any) => {
  const { t } = useTranslation()
  const { resolveMany } = useRequests()

  return (
    <Panel>
      <Title type="small" style={textStyles.center}>
        {t('Transaction summary')}
      </Title>
      <View>
        {bundle.txns.map((txn: any, i: number) => {
          const isFirstFailing = estimation && !estimation.success && estimation.firstFailing === i
          // we need to re-render twice per minute cause of DEX deadlines
          const min = Math.floor(Date.now() / 30000)
          return (
            <TxnPreview
              key={[...txn, i].join(':')}
              // passing an unused property to make it update
              minute={min}
              onDismiss={
                bundle.requestIds &&
                (() => resolveMany([bundle.requestIds[i]], { message: REJECT_MSG }))
              }
              txn={txn}
              network={bundle.network}
              account={bundle.identity}
              isFirstFailing={isFirstFailing}
              addressLabel={!!bundle.meta && bundle?.meta?.addressLabel}
            />
          )
        })}

        <View style={[flexboxStyles.directionRow]}>
          <InfoIcon />
          {bundle.requestIds ? (
            <Text fontSize={12} style={[flexboxStyles.flex1, spacings.plTy]}>
              {t(
                'DEGEN TIP: You can sign multiple transactions at once. Add more transactions to this batch by interacting with a connected dApp right now.'
              )}
            </Text>
          ) : (
            <Text fontSize={12} style={[flexboxStyles.flex1, spacings.plTy]}>
              {t('NOTE: You are currently replacing a pending transaction.')}
            </Text>
          )}
        </View>
      </View>
    </Panel>
  )
}

export default TransactionSummary
