import { Location } from 'react-router-dom'

import { RouteProp } from '@react-navigation/native'
import { ParamListBase } from '@react-navigation/routers'

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
