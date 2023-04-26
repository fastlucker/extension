import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import useNotification from '@mobile/modules/web3/hooks/useNotification'
import usePermission from '@mobile/modules/web3/hooks/usePermission'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import sessionService from '@mobile/modules/web3/services/webview-background/services/session'
import useGetProviderInjection from '@mobile/modules/web3/services/webview-inpage/injection-script'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const route = useRoute()
  const { hasPermission, removePermission, setSelectedDappUrl, openBottomSheetPermission } =
    usePermission()
  const { requestNotificationServiceMethod, setWebViewRef } = useNotification()

  const selectedDappUrl = route?.params?.selectedDappUrl

  const providerToInject = useGetProviderInjection()

  useEffect(() => {
    setWebViewRef(webViewRef.current)
  }, [setWebViewRef])

  useEffect(() => {
    setSelectedDappUrl(route?.params?.selectedDappUrl)
    return () => {
      setSelectedDappUrl('')
    }
  }, [route?.params?.selectedDappUrl, setSelectedDappUrl])

  useEffect(() => {
    if (!hasPermission(selectedDappUrl)) {
      setTimeout(() => {
        openBottomSheetPermission()
      }, 1)
    }
  }, [hasPermission, openBottomSheetPermission, selectedDappUrl])

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      // console.log('data', data)
      if (data.method === 'disconnect') {
        removePermission(selectedDappUrl)
        return
      }

      const sessionId = selectedDappUrl
      const origin = selectedDappUrl
      const session = sessionService.getOrCreateSession(sessionId, origin, webViewRef)
      const req = { data, session, origin }

      const result = await providerController(req, requestNotificationServiceMethod)
      console.log('result', result)

      const response = {
        id: data.id,
        method: data.method,
        success: true, // or false if there is an error
        result // or error: {} if there is an error
      }

      if (result) {
        webViewRef?.current?.injectJavaScript(
          `handleProviderResponse(${JSON.stringify(response)});`
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.ph0} hasBottomTabNav>
        {!!hasPermission(selectedDappUrl || '') && (
          <WebView
            ref={webViewRef}
            source={{ uri: selectedDappUrl }}
            onMessage={handleEthereumProviderMessage}
            injectedJavaScriptBeforeContentLoaded={providerToInject}
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
  )
}

export default Web3BrowserScreen
