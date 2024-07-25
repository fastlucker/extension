import { JsonRpcProvider } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking } from 'react-native'

import { extraNetworks, networks as constantNetworks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getRpcProvider } from '@ambire-common/services/provider'
import useSteps from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import { storage } from '@web/extension-services/background/webapi/storage'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

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
  const { networks: settingsNetworks } = useNetworksControllerState()
  const params = new URLSearchParams(route?.search)
  const txnId = params.get('txnId') ?? null
  const userOpHash = params.get('userOpHash') ?? null
  const isRenderedInternally = typeof params.get('isInternal') === 'string'
  const networkId = params.get('networkId')
  const networks = settingsNetworks ?? [...constantNetworks, ...extraNetworks]
  const network = networks.find((n) => n.id === networkId)

  const [provider, setProvider] = useState<JsonRpcProvider | null>(null)
  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')

  useEffect(() => {
    if (!network?.rpcUrls) return

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

      if (isRenderedInternally) {
        address = `https://benzin.ambire.com/?networkId=${networkId}${
          stepsState.txnId ? `&txnId=${stepsState.txnId}` : ''
        }${userOpHash ? `&userOpHash=${userOpHash}` : ''}`
      }

      await setStringAsync(address)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, isRenderedInternally, userOpHash, networkId, stepsState.txnId])

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

  const showCopyBtn = useMemo(() => {
    if (!network) return true

    const isRejected = stepsState.userOpStatusData.status === 'rejected'
    const isCustom = !network.hasRelayer
    return !isCustom && !isRejected
  }, [network, stepsState.userOpStatusData])

  const showOpenExplorerBtn = useMemo(() => {
    if (!network) return true

    const isRejected = stepsState.userOpStatusData.status === 'rejected'
    return !isRejected
  }, [network, stepsState.userOpStatusData])

  if (!networkId || (!txnId && !userOpHash)) return null

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
    showOpenExplorerBtn
  }
}

export default useBenzin
