import { setStringAsync } from 'expo-clipboard'
import { useCallback, useState } from 'react'
import { Linking } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Storage } from '@ambire-common/interfaces/storage'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import useSteps from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'

function produceMemoryStore(): Storage {
  const storage = new Map()

  return {
    get: (key, defaultValue): any => {
      const serialized = storage.get(key)
      return Promise.resolve(serialized ? parse(serialized) : defaultValue)
    },
    set: (key, value) => {
      storage.set(key, stringify(value))
      return Promise.resolve(null)
    }
  }
}
const parseHumanizer = (humanizedCalls: IrCall[], setCalls: Function) => {
  // remove deadlines from humanizer
  const finalParsedCalls = humanizedCalls.map((call) => {
    const localCall = { ...call }
    localCall.fullVisualization = call.fullVisualization?.filter(
      (visual) => visual.type !== 'deadline'
    )
    localCall.warnings = call.warnings?.filter((warn) => warn.content !== 'Unknown address')
    return localCall
  })
  setCalls(finalParsedCalls)
}
const storage = produceMemoryStore()
const emittedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emittedErrors.push(e)
const standardOptions = {
  fetch: window.fetch.bind(window),
  emitError: mockEmitError,
  storage,
  parser: parseHumanizer
}

interface Props {
  onOpenExplorer?: () => void
}

const useBenzin = ({ onOpenExplorer }: Props = {}) => {
  const { addToast } = useToast()
  const route = useRoute()

  const params = new URLSearchParams(route?.search)
  const txnId = params.get('txnId')
  const userOpHash = params.get('userOpHash') ?? null
  const isRenderedInternally = typeof params.get('isInternal') === 'string'
  const [networkId, isUserOp] = [
    params.get('networkId'),
    userOpHash?.length === 66 || typeof params.get('isUserOp') === 'string'
  ]
  const network = networks.find((n) => n.id === networkId)

  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')

  if (!txnId || !network) return null

  const stepsState = useSteps({
    txnId,
    userOpHash,
    network,
    isUserOp,
    standardOptions,
    setActiveStep
  })

  const handleCopyText = useCallback(async () => {
    try {
      let address = window.location.href

      if (isRenderedInternally) {
        address = `https://benzin.ambire.com/?txnId=${txnId}&networkId=${networkId}${
          isUserOp ? '&isUserOp' : ''
        }`
      }

      await setStringAsync(address)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, isRenderedInternally, isUserOp, networkId, txnId])

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return
    const realTxnId = stepsState.userOpStatusData.txnId ?? txnId
    try {
      await Linking.openURL(`${network.explorerUrl}/tx/${realTxnId}`)
    } catch {
      addToast('Error opening explorer', { type: 'error' })
    }
    onOpenExplorer && onOpenExplorer()
  }, [network, stepsState.userOpStatusData.txnId, txnId, onOpenExplorer, addToast])

  return {
    activeStep,
    handleCopyText,
    handleOpenExplorer,
    stepsState,
    network,
    txnId,
    isRenderedInternally
  }
}

export default useBenzin
