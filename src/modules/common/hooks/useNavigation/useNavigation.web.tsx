import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Subject } from 'rxjs'

import { TitleEventStreamType, UseNavigationReturnType } from './types'

/* Event stream that gets triggered when the title should change */
export const titleEventStream: TitleEventStreamType = new Subject<string>()

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

  const setOptions = useCallback<UseNavigationReturnType['setOptions']>(({ headerTitle }) => {
    if (headerTitle) {
      document.title = headerTitle
      titleEventStream.next(headerTitle)
    }

    // All other options are not supported in the web context
  }, [])

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
