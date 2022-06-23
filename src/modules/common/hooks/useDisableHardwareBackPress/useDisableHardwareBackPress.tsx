import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Only disables the hardware back button action, which some devices have.
// Don't forget to add `headerLeft: () => null` and `gestureEnabled: false`
// on the screen settings, so that the back button in the header is also hidden
const useDisableHardwareBackPress = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])
}

export default useDisableHardwareBackPress
