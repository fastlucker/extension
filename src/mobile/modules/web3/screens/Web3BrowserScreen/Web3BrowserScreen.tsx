import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import injectionScript from '@mobile/modules/web3/services/webview-inpage/injection'

import styles from './styles'

const Web3BrowserScreen = () => {
  const [scriptToInject, setScriptToInject] = useState<any>(null)

  const webViewRef = useRef(null)
  const route = useRoute()
  const { goBack } = useNavigation()
  const { addToast } = useToast()

  useEffect(() => {}, [])

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = (event) => {
    const msg = JSON.parse(event.nativeEvent.data)
    console.log('msg', msg)
    // if (typeof event?.nativeEvent?.data === 'object') {
    //   // Parse the message data
    //   const { type, payload } = JSON.parse(event?.nativeEvent?.data)
    //   console.log(type, payload)
    // }
  }

  const selectedDappUrl = route?.params?.selectedDappUrl

  return (
    <>
      <GradientBackgroundWrapper>
        <Wrapper style={spacings.ph0} hasBottomTabNav>
          {!!selectedDappUrl && (
            <WebView
              ref={webViewRef}
              source={{ uri: selectedDappUrl }}
              onMessage={handleEthereumProviderMessage}
              injectedJavaScript={injectionScript}
              // TODO:
              // injectedJavaScript={scriptToInject}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingWrapper}>
                  <Spinner />
                </View>
              )}
              containerStyle={styles.container}
              style={styles.webview}
            />
          )}
        </Wrapper>
      </GradientBackgroundWrapper>
    </>
  )
}

export default Web3BrowserScreen
