import React, { useCallback, useState } from 'react'
import { ImageBackground, Linking, ScrollView, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'

import Buttons from './components/Buttons'
import Header from './components/Header'
import Steps from './components/Steps'
import useSteps from './components/Steps/hooks/useSteps'
import getStyles from './styles'

const emittedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emittedErrors.push(e)
const standardOptions = { fetch, emitError: mockEmitError }

const BenzinScreen = () => {
  const { styles } = useTheme(getStyles)
  const route = useRoute()

  const params = new URLSearchParams(route?.search)
  const txnId = params.get('txnId')
  const [networkId, isUserOp] = [
    params.get('networkId'),
    typeof params.get('isUserOp') === 'string'
  ]
  const network = networks.find((n) => n.id === networkId)

  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return
    await Linking.openURL(`${network.explorerUrl}/tx/${txnId}`)
  }, [network, txnId])

  if (!network || !txnId) {
    // @TODO
    return <Text>Error loading transaction</Text>
  }

  const stepsState = useSteps({
    txnId,
    network,
    isUserOp,
    standardOptions,
    setActiveStep
  })

  return (
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
          <Buttons handleOpenExplorer={handleOpenExplorer} />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default BenzinScreen
