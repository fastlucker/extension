import { useLocation } from 'react-router-dom'

const useRoute = () => {
  const route = useLocation()

  return {
    ...route,
    params: route.state || {},
    path: route.pathname
  }
}

export default useRoute
