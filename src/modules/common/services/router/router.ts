import { ROUTES } from '@config/Router/routesConfig'

export const isRouteWithTabBar = (routeName: string) =>
  routeName === ROUTES.dashboard ||
  routeName === `${ROUTES.dashboard}-screen` ||
  routeName === `${ROUTES.collectibles}-screen` ||
  routeName === ROUTES.earn ||
  routeName === ROUTES.send ||
  routeName === ROUTES.swap ||
  routeName === ROUTES.transactions
