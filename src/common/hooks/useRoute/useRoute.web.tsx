import { useLocation } from 'react-router-dom'

import { UseRouteReturnType } from './types'

function getSearchParamsAsObject() {
  const route = useLocation()
  const params = new URLSearchParams(route.search)
  const paramsObject: any = {}

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of params.entries()) {
    paramsObject[key] = value
  }

  return paramsObject
}

const useRoute = (): UseRouteReturnType => {
  const route = useLocation()

  return {
    ...route,
    params: route.state || getSearchParamsAsObject() || {},
    path: route.pathname
  }
}

export default useRoute
