import React, { useEffect, useLayoutEffect } from 'react'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import usePrevious from '@modules/common/hooks/usePrevious'
import useRequests from '@modules/common/hooks/useRequests'
import textStyles from '@modules/common/styles/utils/text'
import FeeSelector from '@modules/pending-transactions/components/FeeSelector'
import SignActions from '@modules/pending-transactions/components/SignActions'
import SigningWithAccount from '@modules/pending-transactions/components/SigningWithAccount'
import TransactionSummary from '@modules/pending-transactions/components/TransactionSummary'
import useSendTransaction from '@modules/pending-transactions/hooks/useSendTransaction'
import { StackActions } from '@react-navigation/native'

const PendingTransactionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { setSendTxnState, sendTxnState, resolveMany, everythingToSign } = useRequests()
  const { account } = useAccounts()
  const {
    bundle,
    signingStatus,
    estimation,
    feeSpeed,
    setEstimation,
    setFeeSpeed,
    approveTxn,
    rejectTxn
  } = useSendTransaction()

  const prevBundle: any = usePrevious(bundle)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Pending Transactions: {{numTxns}}', { numTxns: bundle?.txns?.length })
    })
  }, [navigation, bundle?.txns?.length])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sendTxnState.showing) {
        setSendTxnState({ showing: false })
      }
      if (everythingToSign.length) {
        resolveMany([everythingToSign[0].id], {
          message: t('Ambire user rejected the signature request')
        })
      }
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (sendTxnState.showing) {
        setSendTxnState({ showing: false })
      }
      if (everythingToSign.length) {
        resolveMany([everythingToSign[0].id], {
          message: t('Ambire user rejected the signature request')
        })
      }
      navigation.dispatch(StackActions.popToTop())
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (prevBundle?.txns?.length && !bundle?.txns?.length) {
      navigation.goBack()
    }
  })

  if (!account || !bundle?.txns?.length)
    return (
      <Wrapper>
        <Text style={{ color: 'red' }}>
          {t('SendTransactions: No account or no requests: should never happen.')}
        </Text>
      </Wrapper>
    )

  return (
    <Wrapper>
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
      {!!bundle?.signer?.quickAccManager && !CONFIG.RELAYER_URL ? (
        <Text fontSize={17} type={TEXT_TYPES.DANGER} style={textStyles.bold}>
          {t(
            'Signing transactions with an email/password account without being connected to the relayer is unsupported.'
          )}
        </Text>
      ) : (
        <SignActions
          bundle={bundle}
          estimation={estimation}
          approveTxn={approveTxn}
          rejectTxn={rejectTxn}
          signingStatus={signingStatus}
          feeSpeed={feeSpeed}
        />
      )}
    </Wrapper>
  )
}

export default PendingTransactionsScreen
