import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import { RouteProp, useNavigation } from '@react-navigation/native'

import styles from './styles'

interface Props {
  route: RouteProp<{ params: { name: string; uri: string } }, 'params'>
}

const ProviderScreen = ({ route }: Props) => {
  const { name, uri } = route.params
  const { goBack, setOptions } = useNavigation()

  useEffect(() => {
    if (!uri) {
      goBack()
    }
  }, [uri, goBack])

  useLayoutEffect(() => {
    setOptions({
      headerTitle: name
    })
  }, [name, setOptions])

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false} style={spacings.ph0} contentContainerStyle={spacings.pb0}>
        <WebView
          originWhitelist={['*']}
          source={{ uri }}
          injectedJavaScriptForMainFrameOnly
          injectedJavaScriptBeforeContentLoadedForMainFrameOnly
          setSupportMultipleWindows
          javaScriptEnabled
          containerStyle={styles.container}
          style={styles.webview}
          bounces={false}
          setBuiltInZoomControls={false}
          overScrollMode="never" // prevents the Android bounce effect (blue shade when scroll to end)
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingWrapper}>
              <Spinner />
            </View>
          )}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ProviderScreen
