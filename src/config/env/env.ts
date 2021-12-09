export const isProd = process.env['APP_ENV'] === 'PRODUCTION'
export const isStaging = process.env['APP_ENV'] === 'STAGING'

enum APP_ENV {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development',
}

interface Config {
  APP_ENV: APP_ENV
}

let CONFIG: Config = {
  APP_ENV: APP_ENV.DEV,
}

if (isProd) {
  CONFIG.APP_ENV = APP_ENV.PROD
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

export default CONFIG
