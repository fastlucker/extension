import { RouteProp, useRoute as useNativeRoute } from '@react-navigation/native'

import type { ParamListBase } from '@react-navigation/routers'

interface Props extends RouteProp<ParamListBase> {
  params: {
    [key: string]: any
  }
}

const useRoute = (): Props => {
  const route = useNativeRoute()

  return {
    ...route,
    params: route?.params || {}
  }
}

export default useRoute
