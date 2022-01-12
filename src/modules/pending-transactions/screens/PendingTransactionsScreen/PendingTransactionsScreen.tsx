import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRequests from '@modules/common/hooks/useRequests'
import FeeSelector from '@modules/pending-transactions/components/FeeSelector'
import SigningWithAccount from '@modules/pending-transactions/components/SigningWithAccount'
import TransactionSummary from '@modules/pending-transactions/components/TransactionSummary'
import useSendTransaction from '@modules/pending-transactions/hooks/useSendTransaction'

const PendingTransactionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { setSendTxnState } = useRequests()
  const { account } = useAccounts()
  const { bundle, signingStatus, estimation, feeSpeed, setEstimation, setFeeSpeed } =
    useSendTransaction()

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        setSendTxnState({ showing: false })
      }),
    [navigation]
  )

  if (!account || !bundle?.txns?.length)
    return (
      <View>
        <Text>{t('SendTransactions: No account or no requests: should never happen.')}</Text>
      </View>
    )

  return (
    <Wrapper>
      <Text>Pending Transactions</Text>
      <SigningWithAccount />
      <TransactionSummary bundle={bundle} estimation={estimation} />
      <FeeSelector
        disabled={
          signingStatus && signingStatus.finalBundle && !(estimation && !estimation.success)
        }
        signer={bundle.signer}
        estimation={estimation}
        setEstimation={setEstimation}
        feeSpeed={feeSpeed}
        setFeeSpeed={setFeeSpeed}
      />
    </Wrapper>
  )
}

export default PendingTransactionsScreen
