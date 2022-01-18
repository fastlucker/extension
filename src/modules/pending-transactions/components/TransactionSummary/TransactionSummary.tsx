import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { FontAwesome5 } from '@expo/vector-icons'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import useRequests from '@modules/common/hooks/useRequests'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

const REJECT_MSG = 'Ambire user rejected the request'

const TransactionSummary = ({ bundle, estimation }: any) => {
  const { t } = useTranslation()
  const { resolveMany } = useRequests()

  return (
    <Panel>
      <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
        <FontAwesome5
          style={spacings.mrTy}
          name="glasses"
          size={18}
          color={colors.primaryAccentColor}
        />
        <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
          {t('Transaction summary')}
        </Title>
      </View>
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
            />
          )
        })}

        <View>
          <Text>
            {bundle.requestIds ? (
              <Text>
                <Text style={textStyles.bold}>{'DEGEN TIP: '}</Text>
                <Text>
                  You can sign multiple transactions at once. Add more transactions to this batch by
                  interacting with a connected dApp right now.
                </Text>
              </Text>
            ) : (
              <Text>
                <Text style={textStyles.bold}>{'NOTE: '}</Text>
                <Text>You are currently replacing a pending transaction.</Text>
              </Text>
            )}
          </Text>
        </View>
      </View>
    </Panel>
  )
}

export default TransactionSummary
