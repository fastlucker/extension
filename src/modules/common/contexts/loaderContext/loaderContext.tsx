import { BlurView } from 'expo-blur'
import LottieView from 'lottie-react-native'
import React, { useMemo, useState } from 'react'

import LoaderAnimation from './loader-animation.json'
import styles from './styles'

type LoaderContextData = {
  showLoader: () => void
  hideLoader: () => void
  isVisible: boolean
}

export const LOADER_BACKGROUND_BLUR = 45

const LoaderContext = React.createContext<LoaderContextData>({
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
        <BlurView style={styles.container} tint="dark" intensity={LOADER_BACKGROUND_BLUR}>
          <LottieView source={LoaderAnimation} style={{ width: 86, height: 86 }} autoPlay loop />
        </BlurView>
      )}
      {children}
    </LoaderContext.Provider>
  )
}

export { LoaderContext, LoaderProvider }
