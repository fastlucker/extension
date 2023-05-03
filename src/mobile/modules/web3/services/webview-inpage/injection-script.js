import RNFS from 'react-native-fs'
import networks from 'ambire-common/src/constants/networks'

import { useEffect, useState } from 'react'
// TODO: fix path
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'
import eventEmitterScript from './EventEmitterScript'

const interval = 1000

const useGetProviderInjection = () => {
  const [provider, setProvider] = useState('')

  const filePath = `${RNFS.MainBundlePath}/EthereumProvider.js`

  useEffect(() => {
    let intervalId
    let prevModifiedTime

    const readAndSetProvider = () => {
      RNFS.stat(filePath)
        .then((stats) => {
          const modifiedTime = stats.mtimeMs

          if (modifiedTime !== prevModifiedTime) {
            prevModifiedTime = modifiedTime

            RNFS.readFile(filePath, 'utf8')
              .then((newContents) => {
                setProvider(newContents)
              })
              .catch((error) => {
                console.error(`Error reloading ${filePath}:`, error)
              })
          }
        })
        .catch((error) => {
          console.error(`Error checking modification time of ${filePath}:`, error)
        })
    }

    RNFS.readFile(filePath, 'utf8')
      .then((initialContents) => {
        setProvider(initialContents)
        // console.log(`Initial contents of ${filePath}:`, initialContents)

        // Periodically check the modification time of the file and reload it if it has changed
        intervalId = setInterval(readAndSetProvider, interval)
      })
      .catch((error) => {
        console.error(`Error reading initial contents of ${filePath}:`, error)
      })

    return () => {
      clearInterval(intervalId)
    }
  }, [filePath, provider])

  const script = `
    ${eventEmitterScript}
    const networks = ${JSON.stringify(networks)};
    const DAPP_PROVIDER_URLS = ${JSON.stringify(DAPP_PROVIDER_URLS)};
    ${provider}
  `
  return script
}

export default useGetProviderInjection
