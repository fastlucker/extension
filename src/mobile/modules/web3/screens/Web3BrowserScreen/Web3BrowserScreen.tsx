import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import useWeb3 from '@mobile/modules/web3/hooks/useWeb3'
import useGetProviderInjection from '@mobile/modules/web3/services/webview-inpage/injection-script'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const route = useRoute()

  const { setWeb3ViewRef, handleWeb3Request, setSelectedDappUrl } = useWeb3()

  const selectedDappUrl = route?.params?.selectedDappUrl

  const { script: providerToInject } = useGetProviderInjection()

  useEffect(() => {
    setWeb3ViewRef(webViewRef.current)
    setSelectedDappUrl(route?.params?.selectedDappUrl)
    return () => {
      setWeb3ViewRef(null)
      setSelectedDappUrl('')
    }
  }, [route?.params?.selectedDappUrl, setWeb3ViewRef, setSelectedDappUrl])

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      handleWeb3Request({ data })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.ph0} hasBottomTabNav>
        <WebView
          ref={webViewRef}
          source={{ uri: providerToInject ? selectedDappUrl : null }}
          onMessage={handleEthereumProviderMessage}
          injectedJavaScriptBeforeContentLoaded={providerToInject}
          javaScriptEnabled
          startInLoadingState
          bounces={false}
          renderLoading={() => (
            <View style={styles.loadingWrapper}>
              <Spinner />
            </View>
          )}
          containerStyle={styles.container}
          style={styles.webview}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default Web3BrowserScreen
