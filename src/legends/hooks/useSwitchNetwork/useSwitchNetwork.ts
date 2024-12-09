import { BASE_CHAIN_ID } from '@legends/constants/network'

import useAccountContext from '../useAccountContext'
import useToast from '../useToast'

const useSwitchNetwork = (newChainId: number = BASE_CHAIN_ID) => {
  const { chainId } = useAccountContext()
  const { addToast } = useToast()
  const isAlreadyConnected = Number(chainId) === newChainId

  const switchNetwork = async () => {
    // Request a chain change to base and a sign message to associate the EOA address
    try {
      if (isAlreadyConnected) return
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: newChainId }]
      })
    } catch {
      addToast('Failed to switch to Base Network', 'error')
    }
  }

  return switchNetwork
}

export default useSwitchNetwork
