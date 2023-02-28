import { ROUTES } from '@config/Router/routesConfig'

export type NavigateOptions = {
  state?: {
    [key: string]: any
  }
  replace?: boolean
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

export interface UseNavigationReturnType {
  navigate: (to: ROUTES | number, options?: NavigateOptions) => void
}
