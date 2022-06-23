import * as React from 'react'

import { NavigationContainerRef } from '@react-navigation/native'

// TODO: switch from <any> to <RootParamList>
export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  React.createRef<NavigationContainerRef<any>>()
export const routeNameRef: React.RefObject<string> = React.createRef()

// Mechanism for being able to navigate without the navigation prop.
// {@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
export function navigate(name: string, params?: object): void {
  navigationRef?.current?.navigate(name, params)
}
