import { NavigateOptions } from 'react-router-dom'
import { Subject } from 'rxjs'

import { NavigationProp } from '@react-navigation/native'

interface UseNavigationReturnTypeCommon {
  navigate: (to: string, options?: NavigateOptions) => void
  goBack: NavigationProp<ReactNavigation.RootParamList>['goBack']
  setParams: NavigationProp<ReactNavigation.RootParamList>['setParams']
  setOptions: NavigationProp<ReactNavigation.RootParamList>['setOptions']
  canGoBack: boolean
}

export type UseNavigationReturnType = UseNavigationReturnTypeCommon

export type TitleChangeEventStreamType = Subject<string> | null
