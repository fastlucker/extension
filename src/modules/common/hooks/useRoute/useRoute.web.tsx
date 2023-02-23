import { useLocation } from 'react-router-dom'

const useRoute = () => {
  const route = useLocation()

  return {
    params: route.state || {}
  }
}

export default useRoute
