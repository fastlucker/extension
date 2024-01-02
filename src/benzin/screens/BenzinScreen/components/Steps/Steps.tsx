import { ethers } from 'ethers'
import React, { FC } from 'react'
import { View } from 'react-native'

import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import OpenIcon from '@common/assets/svg/OpenIcon'
import spacings from '@common/styles/spacings'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import Step from './components/Step'
import useSteps from './hooks/useSteps'
import { getFee, getFinalizedRows, getTimestamp, shouldShowTxnProgress } from './utils/rows'

const emittedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emittedErrors.push(e)
const standardOptions = { fetch, emitError: mockEmitError }

interface Props {
  activeStep: ActiveStepType
  network: NetworkDescriptor
  isUserOp: boolean
  txnId: string
  handleOpenExplorer: () => void
  setActiveStep: (step: ActiveStepType) => void
}

const Steps: FC<Props> = ({
  activeStep,
  network,
  isUserOp,
  txnId,
  handleOpenExplorer,
  setActiveStep
}) => {
  const { nativePrice, blockData, finalizedStatus, cost, calls } = useSteps({
    txnId,
    network,
    isUserOp,
    standardOptions,
    setActiveStep
  })

  return (
    <View style={IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb3Xl : spacings.mbXl}>
      <Step
        title="Signed"
        stepName="signed"
        activeStep={activeStep}
        rows={[
          {
            label: 'Timestamp',
            value: getTimestamp(blockData, finalizedStatus)
          },
          {
            label: 'Transaction fee',
            value: getFee(cost, network, nativePrice, finalizedStatus)
          },
          {
            label: 'Transaction ID',
            value: txnId,
            isValueSmall: true
          }
        ]}
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
          {calls.map((call, i) => {
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
        </Step>
      )}
      <Step
        title={finalizedStatus && finalizedStatus.status ? finalizedStatus.status : 'Fetching'}
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
