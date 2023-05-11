import RNFS from 'react-native-fs'
import networks from 'ambire-common/src/constants/networks'

import { useEffect, useState } from 'react'
// TODO: fix path
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'
import { ETH_RPC_METHODS_AMBIRE_MUST_HANDLE } from '@web/constants/common'
import { isiOS } from '@common/config/env'
import eventEmitterScript from './EventEmitterScript'

const useGetProviderInjection = () => {
  const [provider, setProvider] = useState('')

  useEffect(() => {
    isiOS
      ? RNFS.readFile(`${RNFS.MainBundlePath}/EthereumProvider.js`, 'utf8')
          .then((script) => {
            setProvider(`
            ${eventEmitterScript}
            const networks = ${JSON.stringify(networks)};
            const DAPP_PROVIDER_URLS = ${JSON.stringify(DAPP_PROVIDER_URLS)};
            const ETH_RPC_METHODS_AMBIRE_MUST_HANDLE = ${JSON.stringify(
              ETH_RPC_METHODS_AMBIRE_MUST_HANDLE
            )};
            ${script}
          `)
          })
          .catch((error) => {
            console.error(`Error reloading ${`${RNFS.MainBundlePath}/EthereumProvider.js`}:`, error)
          })
      : RNFS.readFileAssets('EthereumProvider.js', 'utf8')
          .then((script) => {
            setProvider(`
            ${eventEmitterScript}
            const networks = ${JSON.stringify(networks)};
            const DAPP_PROVIDER_URLS = ${JSON.stringify(DAPP_PROVIDER_URLS)};
            const ETH_RPC_METHODS_AMBIRE_MUST_HANDLE = ${JSON.stringify(
              ETH_RPC_METHODS_AMBIRE_MUST_HANDLE
            )};
            ${script}
          `)
          })
          .catch((error) => {
            console.error('Error reloading EthereumProvider.js:', error)
          })
  }, [])

  return {
    script: provider
  }
}

export default useGetProviderInjection
