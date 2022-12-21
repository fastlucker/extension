import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Disables navigation back from a certain screen
const useDisableNavigatingBack = (navigation?: any, enabled: boolean = true) => {
  useEffect(() => {
    let backHandler: any = null
    if (enabled) {
      navigation?.setOptions({
        headerLeft: () => null,
        gestureEnabled: false
      })
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    }
    return () => !!backHandler && backHandler.remove()
  }, [navigation, enabled])
}

export default useDisableNavigatingBack
