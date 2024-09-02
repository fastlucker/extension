import { setStringAsync } from 'expo-clipboard'
import { useCallback, useMemo, useState } from 'react'
import { Linking } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { AccountOpIdentifiedBy } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { relayerCall } from '@ambire-common/libs/relayerCall/relayerCall'
import useSteps from '@benzin/screens/BenzinScreen/hooks/useSteps'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { getBenzinUrlParams } from '@benzin/screens/BenzinScreen/utils/url'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import { RELAYER_URL } from '@env'
import { storage } from '@web/extension-services/background/webapi/storage'

import useBenzinGetNetwork from './useBenzinGetNetwork'
import useBenzinGetProvider from './useBenzinGetProvider'

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
const fetch = window.fetch.bind(window) as any
const standardOptions = {
  fetch,
  callRelayer: relayerCall.bind({ url: RELAYER_URL, fetch }),
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
    relayerId: params.get('relayerId') ?? null,
    isRenderedInternally: typeof params.get('isInternal') === 'string',
    chainId: params.get('chainId'),
    networkId: params.get('networkId')
  }
}

const getChainId = (networkId: string | null, paramsChainId: string | null) => {
  if (paramsChainId) return paramsChainId

  const chainIdDerivedFromNetworkId = constantNetworks.find(
    (network) => network.id === networkId
  )?.chainId

  if (!chainIdDerivedFromNetworkId) return null

  return String(chainIdDerivedFromNetworkId)
}

const useBenzin = ({ onOpenExplorer }: Props = {}) => {
  const { addToast } = useToast()
  const route = useRoute()
  const {
    txnId,
    userOpHash,
    relayerId,
    isRenderedInternally,
    chainId: paramChainId,
    networkId
  } = getParams(route?.search)

  const chainId = getChainId(networkId, paramChainId)
  const { network, isNetworkLoading } = useBenzinGetNetwork({ chainId })
  const { provider } = useBenzinGetProvider({ network })
  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')
  const isInitialized = !isNetworkLoading

  const stepsState = useSteps({
    txnId,
    userOpHash,
    relayerId,
    network,
    standardOptions,
    setActiveStep,
    provider
  })

  const identifiedBy: AccountOpIdentifiedBy = useMemo(() => {
    if (relayerId) return { type: 'Relayer', identifier: relayerId }
    if (userOpHash) return { type: 'UserOperation', identifier: userOpHash }
    return { type: 'Transaction', identifier: txnId as string }
  }, [relayerId, userOpHash, txnId])

  const handleCopyText = useCallback(async () => {
    try {
      let address = window.location.href

      if (chainId) {
        address = `https://benzin.ambire.com/${getBenzinUrlParams({
          chainId,
          txnId: stepsState.txnId,
          identifiedBy
        })}`
      }

      await setStringAsync(address)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, chainId, stepsState.txnId, identifiedBy])

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

    const isRejected = stepsState.finalizedStatus?.status === 'rejected'
    return !isRejected
  }, [network, stepsState.finalizedStatus?.status])

  const showOpenExplorerBtn = useMemo(() => {
    if (!network) return false
    if (relayerId && !stepsState.txnId) return false

    const isRejected = stepsState.finalizedStatus?.status === 'rejected'
    return !isRejected
  }, [network, stepsState.finalizedStatus?.status, relayerId, stepsState.txnId])

  if (!chainId || (!txnId && !userOpHash && !relayerId)) return null

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
