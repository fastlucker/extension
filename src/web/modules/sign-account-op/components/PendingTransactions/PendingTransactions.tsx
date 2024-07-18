import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { Call } from '@ambire-common/interfaces/userRequest'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import PendingTransactionsSkeleton from './PendingTransactionsSkeleton'
import getStyles from './styles'

interface Props {
  callsToVisualize: (IrCall | Call)[]
  network?: Network
}

const PendingTransactions: FC<Props> = ({ callsToVisualize, network }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { networks } = useNetworksControllerState()

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
                networks={networks}
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
