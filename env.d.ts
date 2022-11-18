// Define the environment variables types here, so that the ts imports don't complain
// {@link https://github.com/goatandsheep/react-native-dotenv/issues/52#issuecomment-673218479|
declare module '@env' {
  export const RELAYER_URL: string
  export const APP_RELAYRLESS: string
  export const CONSTANTS_ENDPOINT: string
  export const SWAP_URL: string

  export const RPC_URL_ETHEREUM: string
  export const RPC_URL_POLYGON: string
  export const RPC_URL_AVALANCHE: string
  export const RPC_URL_BNB_CHAIN: string
  export const RPC_URL_FANTOM: string
  export const RPC_URL_MOONBEAM: string
  export const RPC_URL_MOONRIVER: string
  export const RPC_URL_ARBITRUM: string
  export const RPC_URL_GNOSIS: string
  export const RPC_URL_KUCOIN: string
  export const RPC_URL_OPTIMISM: string
  export const RPC_URL_ANDROMEDA: string
  export const RPC_URL_RINKEBY: string
  export const RPC_URL_CRONOS: string
  export const RPC_URL_AURORA: string
  export const RPC_URL_ETHEREUM_POW: string

  export const ZAPPER_API_ENDPOINT: string
  export const ZAPPER_API_KEY: string
  export const VELCRO_API_ENDPOINT: string

  export const RAMP_HOST_API_KEY: string
  export const TRANSAK_API_KEY_STAGING: string
  export const TRANSAK_API_KEY_PROD: string
  export const PAYTRIE_PARTNER_URL: string

  export const SENTRY_DSN: string
}
