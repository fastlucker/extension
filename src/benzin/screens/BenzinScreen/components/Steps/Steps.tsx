import { ethers } from 'ethers'
import React, { FC } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { StepsData } from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import Step from './components/Step'
import { getFee, getFinalizedRows, getTimestamp, shouldShowTxnProgress } from './utils/rows'

interface Props {
  activeStep: ActiveStepType
  network: NetworkDescriptor
  txnId: string | null
  userOpHash: string | null
  handleOpenExplorer: () => void
  stepsState: StepsData
}

const Steps: FC<Props> = ({
  activeStep,
  network,
  txnId,
  userOpHash,
  handleOpenExplorer,
  stepsState
}) => {
  const { nativePrice, blockData, finalizedStatus, cost, calls } = stepsState

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

  if (txnId) {
    stepRows.push({
      label: 'Transaction ID',
      value: txnId,
      isValueSmall: true
    })
  }

  if (userOpHash) {
    stepRows.push({
      label: 'User Operation ID',
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
      />
      {shouldShowTxnProgress(finalizedStatus) && (
        <Step
          title={
            activeStep === 'finalized' ? 'Transaction details' : 'Your transaction is in progress'
          }
          stepName="in-progress"
          activeStep={activeStep}
          finalizedStatus={finalizedStatus}
        >
          {calls &&
            calls.map((call, i) => {
              return (
                <TransactionSummary
                  key={call.data + ethers.randomBytes(6)}
                  style={i !== calls.length! - 1 ? spacings.mbSm : {}}
                  call={call}
                  networkId={network!.id}
                  explorerUrl={network!.explorerUrl}
                  rightIcon={
                    <OpenIcon
                      width={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
                      height={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
                    />
                  }
                  onRightIconPress={handleOpenExplorer}
                  size={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'lg' : 'sm'}
                />
              )
            })}
          {calls && !calls.length && stepsState.finalizedStatus?.status !== 'fetching' && (
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

export default Steps
