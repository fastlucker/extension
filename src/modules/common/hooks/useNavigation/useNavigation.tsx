import { useNavigation as useNav } from '@react-navigation/native'

type Options = {
  state?: {
    [key: string]: any
  }
  replace?: boolean
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

const useNavigation = (): {
  navigate: (url: string, options?: Options) => void
} => {
  const nav: any = useNav()

  const navigate = (url: string, options?: Options) => {
    return nav.navigate(url, options?.state)
  }

  return {
    ...nav,
    navigate
  }
}

export default useNavigation
