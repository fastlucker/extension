import { JsonRpcProvider } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import { useCallback, useMemo, useState } from 'react'
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
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

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
      (visual) => visual.type !== 'deadline' && !visual.isHidden
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
  const { networks: settingsNetworks } = useSettingsControllerState()
  const params = new URLSearchParams(route?.search)
  const txnId = params.get('txnId') ?? null
  const userOpHash = params.get('userOpHash') ?? null
  const isRenderedInternally = typeof params.get('isInternal') === 'string'
  const networkId = params.get('networkId')
  const useNetworks = settingsNetworks ?? networks
  const network = useNetworks.find((n) => n.id === networkId)

  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')

  if ((!txnId && !userOpHash) || !network) return null

  const provider = useMemo(() => {
    return new JsonRpcProvider(network.rpcUrl)
  }, [network])

  const stepsState = useSteps({
    txnId,
    userOpHash,
    network,
    standardOptions,
    setActiveStep,
    provider
  })

  const handleCopyText = useCallback(async () => {
    try {
      let address = window.location.href

      if (isRenderedInternally) {
        address = `https://benzin.ambire.com/?networkId=${networkId}${
          txnId ? `&txnId=${txnId}` : ''
        }${userOpHash ? `&userOpHash=${userOpHash}` : ''}`
      }

      await setStringAsync(address)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, isRenderedInternally, userOpHash, networkId, txnId])

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return

    const link = stepsState.txnId
      ? `${network.explorerUrl}/tx/${stepsState.txnId}`
      : `https://jiffyscan.xyz/userOpHash/${userOpHash}?network=${network.id}`

    try {
      await Linking.openURL(link)
    } catch {
      addToast('Error opening explorer', { type: 'error' })
    }
    onOpenExplorer && onOpenExplorer()
  }, [network, userOpHash, stepsState.txnId, onOpenExplorer, addToast])

  return {
    activeStep,
    handleCopyText,
    handleOpenExplorer,
    stepsState,
    network,
    txnId: stepsState.txnId,
    userOpHash,
    isRenderedInternally
  }
}

export default useBenzin
