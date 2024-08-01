declare module '@trezor/connect-webextension' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  export * from '@trezor/connect-webextension/lib/index'
  import trezorConnect from '@trezor/connect-webextension/lib/index'
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { TrezorConnect } from '@trezor/connect/lib/types/api/index'

  export { TrezorConnect }
  export default trezorConnect
}
