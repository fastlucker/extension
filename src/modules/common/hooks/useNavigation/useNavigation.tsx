import { useCallback } from 'react'

import { useNavigation as useReactNavigation } from '@react-navigation/native'

import { UseNavigationReturnType } from './types'

const useNavigation = (): UseNavigationReturnType => {
  const nav = useReactNavigation()

  const navigate = useCallback<UseNavigationReturnType['navigate']>(
    (to, options) => {
      // @ts-ignore
      return nav.navigate(to?.[0] === '/' ? to.substring(1) : to, options?.state)
    },
    [nav]
  )

  return {
    ...nav,
    navigate
  }
}

export default useNavigation
