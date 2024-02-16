import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useMemo, useState } from 'react'
import { ImageBackground, Linking, ScrollView, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Storage } from '@ambire-common/interfaces/storage'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import BenzinNotificationScreen from '@web/modules/benzin-notification/screens/BenzinNotificationScreen'

import Buttons from './components/Buttons'
import Header from './components/Header'
import Steps from './components/Steps'
import useSteps from './components/Steps/hooks/useSteps'
import getStyles from './styles'

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

const BenzinScreen = () => {
  const { styles } = useTheme(getStyles)
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

  if (!network || !txnId) {
    // @TODO
    return <Text>Error loading transaction</Text>
  }

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
    await Linking.openURL(`${network.explorerUrl}/tx/${realTxnId}`)
  }, [network, txnId, stepsState])

  const Benzin = useCallback(
    () => (
      <ImageBackground
        style={styles.backgroundImage}
        source={IS_SCREEN_SIZE_DESKTOP_LARGE ? meshGradientLarge : meshGradient}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.content}>
            <Header activeStep={activeStep} network={network} stepsState={stepsState} />
            <Steps
              activeStep={activeStep}
              network={network}
              txnId={txnId}
              handleOpenExplorer={handleOpenExplorer}
              stepsState={stepsState}
            />
            {!isRenderedInternally && (
              <Buttons handleCopyText={handleCopyText} handleOpenExplorer={handleOpenExplorer} />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    ),
    [
      activeStep,
      handleCopyText,
      handleOpenExplorer,
      isRenderedInternally,
      network,
      stepsState,
      styles.backgroundImage,
      styles.container,
      styles.content,
      txnId
    ]
  )

  return isRenderedInternally ? (
    <BenzinNotificationScreen
      buttons={<Buttons handleCopyText={handleCopyText} handleOpenExplorer={handleOpenExplorer} />}
    >
      <Benzin />
    </BenzinNotificationScreen>
  ) : (
    <Benzin />
  )
}

export default BenzinScreen
