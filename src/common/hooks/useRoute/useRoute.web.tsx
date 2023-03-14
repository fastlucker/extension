import { useLocation } from 'react-router-dom'

import { UseRouteReturnType } from './types'

const useRoute = (): UseRouteReturnType => {
  const route = useLocation()

  return {
    ...route,
    params: route.state || {},
    path: route.pathname
  }
}

export default useRoute
