import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type Options = {
  state?: {
    [key: string]: any
  }
  replace?: boolean
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

const useNavigation = () => {
  const nav: any = useNavigate()
  const prevRoute = useLocation()

  const navigate = useCallback(
    (to: string | number, options?: Options) => {
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

  const setOptions = () => {}

  return {
    navigate,
    setOptions,
    goBack
  }
}

export default useNavigation
