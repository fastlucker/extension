import React, { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'
import { WebView } from 'react-native-webview'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import usePermission from '@mobile/modules/web3/hooks/usePermission'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import sessionService from '@mobile/modules/web3/services/webview-background/services/session'
import useGetProviderInjection from '@mobile/modules/web3/services/webview-inpage/injection-script'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const route = useRoute()
  const { hasPermission, addPermission } = usePermission()
  const { goBack } = useNavigation()

  const selectedDappUrl = route?.params?.selectedDappUrl

  const providerToInject = useGetProviderInjection()

  const openApprovalModal = (approval: any) => {
    console.log('approval', approval)
    if (approval?.approvalComponent === 'SendTransaction') {
    }
  }

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      console.log('data', data)
      const sessionId = selectedDappUrl
      const origin = selectedDappUrl
      const session = sessionService.getOrCreateSession(sessionId, origin, webViewRef)
      const req = { data, session, origin }

      const result = await providerController(req, openApprovalModal)
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

  useEffect(() => {
    if (!hasPermission(selectedDappUrl)) {
      setTimeout(() => {
        openBottomSheet()
      }, 1)
    }
  }, [hasPermission, openBottomSheet, selectedDappUrl])

  // const denyPermission = useCallback(() => {
  //   goBack()
  // }, [goBack])

  const grantPermission = useCallback(() => {
    addPermission(selectedDappUrl)
  }, [selectedDappUrl, addPermission])

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
        <BottomSheet
          id="allow-dapp-to-connect"
          sheetRef={sheetRef}
          closeBottomSheet={() => {
            setTimeout(() => {
              if (!hasPermission(selectedDappUrl)) {
                closeBottomSheet()
                goBack()
              } else {
                closeBottomSheet()
              }
            }, 10)
          }}
        >
          <Title>{`Allow ${selectedDappUrl} dApp to Connect`}</Title>
          <Button text="Allow" onPress={grantPermission} />
        </BottomSheet>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default Web3BrowserScreen
