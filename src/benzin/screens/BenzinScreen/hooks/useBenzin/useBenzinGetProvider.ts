import { JsonRpcProvider } from 'ethers'
import { useEffect, useState } from 'react'

import { Network } from '@ambire-common/interfaces/network'

interface Props {
  network: Network | null
}

const checkIsRpcUrlWorking = async (rpcUrl: string) => {
  const provider = new JsonRpcProvider(rpcUrl)

  try {
    await provider.getBlockNumber()
  } catch {
    provider?.destroy()
    return false
  }

  provider.destroy()

  return true
}

const rollProviderUrlsAndFindWorking = async (
  rpcUrls: string[],
  index: number
): Promise<string | null> => {
  const isProviderWorking = await checkIsRpcUrlWorking(rpcUrls[index])

  if (isProviderWorking) {
    return rpcUrls[index]
  }

  const nextIndex = index + 1

  if (rpcUrls.length > nextIndex) {
    return rollProviderUrlsAndFindWorking(rpcUrls, nextIndex)
  }

  return null
}

const useBenzinGetProvider = ({ network }: Props) => {
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null)

  useEffect(() => {
    if (!network || provider) return

    const { rpcUrls } = network

    const getProvider = async () => {
      const workingRpcUrl = await rollProviderUrlsAndFindWorking(rpcUrls, 0)

      if (!workingRpcUrl) return

      setProvider(new JsonRpcProvider(workingRpcUrl))
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getProvider()
  }, [network, provider])

  return { provider }
}

export default useBenzinGetProvider
