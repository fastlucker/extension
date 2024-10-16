import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { Call } from '@ambire-common/libs/accountOp/types'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import PendingTransactionsSkeleton from './PendingTransactionsSkeleton'
import getStyles from './styles'

interface Props {
  network?: Network
}

const PendingTransactions: FC<Props> = ({ network }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { accountOp } = useSignAccountOpControllerState() || {}
  const lastHumanizedCalls = React.useRef<Call[]>([])
  const [callsToVisualize, setCallsToVisualize] = React.useState<IrCall[]>([])

  useEffect(() => {
    if (!accountOp) return
    const areAccountOpCallsUpdated = accountOp.calls.some(
      (call, i) => call.data !== lastHumanizedCalls.current[i]?.data
    )
    const hasAccountOpChanged = accountOp.calls.length !== lastHumanizedCalls.current.length

    if (!hasAccountOpChanged && !areAccountOpCallsUpdated) return

    const newHumanizedCalls = humanizeAccountOp(accountOp, {})

    setCallsToVisualize(newHumanizedCalls)
    lastHumanizedCalls.current = accountOp.calls
  }, [accountOp])

  return (
    <View style={styles.transactionsContainer}>
      <SectionHeading>{t('Waiting Transactions')}</SectionHeading>
      <ScrollableWrapper style={styles.transactionsScrollView} scrollEnabled>
        {network && callsToVisualize.length ? (
          callsToVisualize.map((call, i) => {
            return (
              <TransactionSummary
                key={`${call.fromUserRequestId!}+${i}`}
                style={i !== callsToVisualize.length - 1 ? spacings.mbSm : {}}
                call={call}
                networkId={network.id}
                testID={`recipient-address-${i}`}
              />
            )
          })
        ) : (
          <PendingTransactionsSkeleton />
        )}
      </ScrollableWrapper>
    </View>
  )
}

export default PendingTransactions
