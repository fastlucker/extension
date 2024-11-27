import { BASE_CHAIN_ID } from '@legends/constants/network'

import useAccountContext from '../useAccountContext'
import useToast from '../useToast'

const useSwitchNetwork = () => {
  const { chainId } = useAccountContext()
  const { addToast } = useToast()
  const isConnectedOnBase = Number(chainId) === BASE_CHAIN_ID

  const switchNetwork = async () => {
    // Request a chain change to base and a sign message to associate the EOA address
    try {
      if (isConnectedOnBase) return
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      })
    } catch {
      addToast('Failed to switch to Base Network', 'error')
    }
  }

  return switchNetwork
}

export default useSwitchNetwork
