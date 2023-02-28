import { useRoute as useNativeRoute } from '@react-navigation/native'

import { UseRouteReturnType } from './types'

const useRoute = (): UseRouteReturnType => {
  const route = useNativeRoute()

  return {
    ...route,
    params: route?.params || {}
  }
}

export default useRoute
