import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Disables navigation back from a certain screen
const useDisableNavigatingBack = (navigation?: any) => {
  useEffect(() => {
    navigation?.setOptions({
      headerLeft: () => null,
      gestureEnabled: false
    })
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [navigation])
}

export default useDisableNavigatingBack
