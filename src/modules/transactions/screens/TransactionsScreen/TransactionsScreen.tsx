import React from 'react'
import { View } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { DetailedBundleProvider } from '@modules/send/contexts/detailedBundleContext'
import useTransactions from '@modules/transactions/hooks/useTransactions'

import TransactionsSectionList from '../../components/TransactionsSectionList'
import styles from './styles'

const TransactionsScreen = () => {
  const {
    data,
    errMsg,
    isLoading,
    speedup,
    replace,
    cancel,
    firstPending,
    showSendTxns,
    forceRefresh
  } = useTransactions()
  const { eligibleRequests } = useRequests()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()

  if (isLoading && !data) {
    return (
      <GradientBackgroundWrapper>
        <Wrapper>
          <View
            style={[flexboxStyles.flex1, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}
          >
            <Spinner />
          </View>
        </Wrapper>
      </GradientBackgroundWrapper>
    )
  }

  return (
    <DetailedBundleProvider>
      <GradientBackgroundWrapper>
        <View style={styles.sectionViewWrapper}>
          <TransactionsSectionList
            data={data}
            errMsg={errMsg}
            isLoading={isLoading}
            speedup={speedup}
            replace={replace}
            cancel={cancel}
            firstPending={firstPending}
            showSendTxns={showSendTxns}
            forceRefresh={forceRefresh}
            eligibleRequests={eligibleRequests}
            networkId={network?.id}
            selectedAcc={selectedAcc}
          />
        </View>
      </GradientBackgroundWrapper>
    </DetailedBundleProvider>
  )
}

export default TransactionsScreen
