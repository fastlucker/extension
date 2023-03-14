import { useIsFocused } from '@react-navigation/native'

const useIsScreenFocused = () => {
  const isFocused = useIsFocused()

  return isFocused
}

export default useIsScreenFocused
