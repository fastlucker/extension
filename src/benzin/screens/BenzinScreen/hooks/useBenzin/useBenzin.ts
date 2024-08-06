import { JsonRpcProvider } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking } from 'react-native'

import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getRpcProvider } from '@ambire-common/services/provider'
import useSteps from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { getBenzinUrlParams } from '@benzin/screens/BenzinScreen/utils/url'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import { storage } from '@web/extension-services/background/webapi/storage'

import useBenzinGetNetwork from './useBenzinGetNetwork'

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
const emittedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emittedErrors.push(e)
const standardOptions = {
  fetch: window.fetch.bind(window) as any,
  emitError: mockEmitError,
  storage,
  parser: parseHumanizer
}

interface Props {
  onOpenExplorer?: () => void
}

const getParams = (search?: string) => {
  const params = new URLSearchParams(search)

  return {
    txnId: params.get('txnId') ?? null,
    userOpHash: params.get('userOpHash') ?? null,
    isRenderedInternally: typeof params.get('isInternal') === 'string',
    chainId: params.get('chainId')
  }
}

const useBenzin = ({ onOpenExplorer }: Props = {}) => {
  const { addToast } = useToast()
  const route = useRoute()
  const { txnId, userOpHash, isRenderedInternally, chainId } = getParams(route?.search)
  const { network, isNetworkLoading } = useBenzinGetNetwork({ chainId })
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null)
  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')
  const isInitialized = !isNetworkLoading

  useEffect(() => {
    if (!network?.rpcUrls || !network.rpcUrls.length) return

    setProvider(getRpcProvider(network.rpcUrls, network.chainId, network.selectedRpcUrl))

    return () => {
      setProvider((prev) => {
        prev?.destroy()

        return null
      })
    }
  }, [network?.rpcUrls, network?.chainId, network?.selectedRpcUrl])

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

      if (chainId) {
        address = `https://benzin.ambire.com/${getBenzinUrlParams({
          chainId,
          txnId: stepsState.txnId,
          userOpHash
        })}`
      }

      await setStringAsync(address)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, chainId, stepsState.txnId, userOpHash])

  const handleOpenExplorer = useCallback(async () => {
    if (!network?.explorerUrl) return

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

  const showCopyBtn = useMemo(() => {
    if (!network) return true

    const isRejected = stepsState.userOpStatusData.status === 'rejected'
    return !isRejected
  }, [network, stepsState.userOpStatusData])

  const showOpenExplorerBtn = useMemo(() => {
    if (!network) return true

    const isRejected = stepsState.userOpStatusData.status === 'rejected'
    return !isRejected
  }, [network, stepsState.userOpStatusData])

  if (!chainId || (!txnId && !userOpHash)) return null

  return {
    activeStep,
    handleCopyText,
    handleOpenExplorer,
    stepsState,
    network,
    txnId: stepsState.txnId,
    userOpHash,
    isRenderedInternally,
    showCopyBtn,
    showOpenExplorerBtn,
    isInitialized
  }
}

export default useBenzin
