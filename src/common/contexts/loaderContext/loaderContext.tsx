import { BlurView } from 'expo-blur'
import LottieView from 'lottie-react-native'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

import LoaderAnimation from './loader-animation.json'
import styles from './styles'

export interface LoaderContextReturnType {
  showLoader: () => void
  hideLoader: () => void
  isVisible: boolean
}

export const LOADER_BACKGROUND_BLUR = 45

const LoaderContext = React.createContext<LoaderContextReturnType>({
  showLoader: () => {},
  hideLoader: () => {},
  isVisible: false
})

const LoaderProvider = ({ children }: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const showLoader = () => {
    setIsVisible(true)
  }

  const hideLoader = () => {
    setIsVisible(false)
  }

  return (
    <LoaderContext.Provider
      value={useMemo(
        () => ({
          showLoader,
          hideLoader,
          isVisible
        }),
        [isVisible]
      )}
    >
      {isVisible && (
        <View style={styles.container}>
          <BlurView style={styles.blur} tint="dark" intensity={LOADER_BACKGROUND_BLUR}>
            <LottieView source={LoaderAnimation} style={{ width: 86, height: 86 }} autoPlay loop />
          </BlurView>
        </View>
      )}
      {children}
    </LoaderContext.Provider>
  )
}

export { LoaderContext, LoaderProvider }
