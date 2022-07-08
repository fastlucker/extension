import { useNavigationState } from '@react-navigation/native'

const defaultRoute = 'dashboard'

const useGetSelectedRoute = () => {
  const state = useNavigationState((s) => s)
  let route = state?.routes?.[state.index]

  while (route.state) {
    route = route.state?.routes?.[route?.state?.index]
  }

  const routeName =
    !route.name || route.name === 'drawer' || route.name === 'tabs' ? defaultRoute : route.name

  return {
    key: route.key,
    name: routeName,
    params: route.params
  }
}

export default useGetSelectedRoute
