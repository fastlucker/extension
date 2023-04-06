import { navigationRef } from '@common/services/navigation'

import { UseRouteReturnType } from './types'

const useRoute = (): UseRouteReturnType => {
  const route = navigationRef.current.getCurrentRoute()

  return {
    ...route,
    params: route?.params || {},
    path: route?.name
  }
}

export default useRoute
