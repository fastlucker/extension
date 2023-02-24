import { useCallback } from 'react'

import { NavigationProp, useNavigation as useReactNavigation } from '@react-navigation/native'

interface Props extends NavigationProp<ReactNavigation.RootParamList> {
  navigate: (url: string | number, options?: Options) => void
}

type Options = {
  state?: {
    [key: string]: any
  }
  replace?: boolean
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

const useNavigation = (): Props => {
  const nav: NavigationProp<ReactNavigation.RootParamList> = useReactNavigation()

  const navigate = useCallback(
    (to: string, options?: Options) => {
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
