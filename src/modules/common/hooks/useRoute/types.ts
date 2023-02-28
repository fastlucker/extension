import { Location } from 'react-router-dom'

import { ParamListBase, RouteProp } from '@react-navigation/native'

export interface UseRouteReturnTypeMobile extends RouteProp<ParamListBase> {
  params: {
    [key: string]: any
  }
}

export interface UseRouteReturnTypeWeb extends Location {
  params: {
    [key: string]: any
  }
}

export type UseRouteReturnType = Partial<UseRouteReturnTypeMobile> & Partial<UseRouteReturnTypeWeb>
