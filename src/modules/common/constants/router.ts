export const TAB_BAR_HEIGHT = 63
export const TAB_BAR_ICON_SIZE = 22
// Currently supported only on iOS
export const TAB_BAR_BLUR = 55

export const isRouteWithTabBar = (routeName: string) =>
  routeName === 'dashboard' ||
  routeName === 'earn' ||
  routeName === 'send' ||
  routeName === 'swap' ||
  routeName === 'transactions'
