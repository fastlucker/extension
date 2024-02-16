import React from 'react'
import { ImageBackground, ScrollView, View } from 'react-native'

// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import Buttons from '@benzin/screens/BenzinScreen/components/Buttons'
import Header from '@benzin/screens/BenzinScreen/components/Header'
import Steps from '@benzin/screens/BenzinScreen/components/Steps'
import useBenzin from '@benzin/screens/BenzinScreen/hooks/useBenzin'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'

import getStyles from './styles'

const Benzin = ({ state }: { state: ReturnType<typeof useBenzin> }) => {
  const { styles } = useTheme(getStyles)

  if (!state?.network || !state?.txnId) {
    // @TODO
    return <Text>Error loading transaction</Text>
  }

  const {
    activeStep,
    network,
    txnId,
    stepsState,
    isRenderedInternally,
    handleCopyText,
    handleOpenExplorer
  } = state

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
          {!isRenderedInternally && (
            <Buttons handleCopyText={handleCopyText} handleOpenExplorer={handleOpenExplorer} />
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default Benzin
