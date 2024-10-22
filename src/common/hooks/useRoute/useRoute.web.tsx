import { useLocation } from 'react-router-dom'

import { UseRouteReturnType } from './types'

function getSearchParamsAsObject(search: string) {
  const params = new URLSearchParams(search)
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
    params: route.state || getSearchParamsAsObject(route.search) || {},
    path: route.pathname
  }
}

export default useRoute
