import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { UseNavigationReturnType } from './types'

const useNavigation = (): UseNavigationReturnType => {
  const nav = useNavigate()
  const prevRoute = useLocation()

  const navigate = useCallback<UseNavigationReturnType['navigate']>(
    (to, options) => {
      if (typeof to === 'string' && to?.[0] !== '/') {
        to = `/${to}`
      }

      return nav(to, {
        ...options,
        state: {
          ...(options?.state || {}),
          prevRoute
        }
      })
    },
    [nav, prevRoute]
  )

  const goBack = useCallback(() => {
    return nav(-1)
  }, [nav])

  // TODO:
  const setOptions = () => {}

  // Needed only in the mobile context
  const setParams = () => {}

  return {
    navigate,
    setParams,
    setOptions,
    goBack
  }
}

export default useNavigation
