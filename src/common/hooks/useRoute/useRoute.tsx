import { navigationRef } from '@common/services/navigation'

import { UseRouteReturnType } from './types'

const useRoute = (): UseRouteReturnType => {
  const route = navigationRef.current.getCurrentRoute()
console.log({
  ...route,
  params: route?.params || {},
  path: route?.name
})
  return {
    ...route,
    params: route?.params || {},
    path: route?.name
  }
}

export default useRoute
