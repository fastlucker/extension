import React, { FC } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { StepsData } from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

import Step from './components/Step'
import { getFee, getFinalizedRows, getTimestamp, shouldShowTxnProgress } from './utils/rows'

interface Props {
  activeStep: ActiveStepType
  network: Network
  txnId: string | null
  userOpHash: string | null
  stepsState: StepsData
  summary: any
}

const Steps: FC<Props> = ({ activeStep, network, txnId, userOpHash, stepsState, summary }) => {
  const { nativePrice, blockData, finalizedStatus, cost, calls, from, originatedFrom } = stepsState

  const stepRows: any = [
    {
      label: 'Timestamp',
      value: getTimestamp(blockData, finalizedStatus)
    },
    {
      label: 'Transaction fee',
      value: getFee(cost, network, nativePrice, finalizedStatus)
    }
  ]

  if (from) {
    stepRows.push({
      label: 'Sender',
      value: from
    })
  }

  if (from && originatedFrom && originatedFrom.toLowerCase() !== from.toLowerCase()) {
    stepRows.push({
      label: 'Originated from',
      value: originatedFrom
    })
  }

  if (txnId) {
    stepRows.push({
      label: 'Transaction ID',
      value: txnId,
      isValueSmall: true
    })
  }

  if (userOpHash) {
    stepRows.push({
      label: 'User Op ID',
      value: userOpHash,
      isValueSmall: true
    })
  }

  return (
    <View style={IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb3Xl : spacings.mbXl}>
      <Step
        title="Signed"
        stepName="signed"
        activeStep={activeStep}
        finalizedStatus={finalizedStatus}
        rows={stepRows}
        testID="signed-step"
      />
      {shouldShowTxnProgress(finalizedStatus) && (
        <Step
          title={
            activeStep === 'finalized' ? 'Transaction details' : 'Your transaction is in progress'
          }
          stepName="in-progress"
          activeStep={activeStep}
          finalizedStatus={finalizedStatus}
          testID="txn-progress-step"
        >
          {!!summary && summary}
          {!!calls && !calls.length && stepsState.finalizedStatus?.status !== 'fetching' && (
            <Text appearance="errorText" fontSize={14}>
              Could not decode calldata
            </Text>
          )}
        </Step>
      )}
      <Step
        // We want to show the user the positive outcome of the transaction while it is still in progress
        title={finalizedStatus && finalizedStatus.status ? finalizedStatus.status : 'Confirmed'}
        stepName="finalized"
        finalizedStatus={finalizedStatus}
        activeStep={activeStep}
        style={spacings.pb0}
        titleStyle={spacings.mb0}
      />
      {activeStep === 'finalized' ? (
        <Step
          testID="finalized-rows"
          style={{
            ...spacings[IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'pt' : 'ptSm'],
            borderWidth: 0
          }}
          rows={getFinalizedRows(blockData, finalizedStatus)}
        />
      ) : null}
    </View>
  )
}

export default React.memo(Steps)
