import ERC20ABI from 'adex-protocol-eth/abi/ERC20'
import { Contract } from 'ethers'
import { formatUnits, Interface } from 'ethers/lib/utils'
import { useCallback } from 'react'

import { rpcProviders } from '@modules/common/services/providers'

import useAccounts from '../useAccounts'
import useNetwork from '../useNetwork'
import { UseTokenReturnType } from './types'

const ERC20Interface = new Interface(ERC20ABI)

const TOKEN_IMAGE_BASE_URL = 'https://storage.googleapis.com/zapper-fi-assets/tokens/'

export default function useToken(): UseTokenReturnType {
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()

  const getTokenDetails = useCallback<UseTokenReturnType['getTokenDetails']>(
    async (tokenAddress) => {
      const provider = network?.id && rpcProviders[network.id]
      const tokenContract = new Contract(tokenAddress, ERC20Interface, provider)

      let token = null
      try {
        const [balanceOf, name, symbol, decimals] = await Promise.all([
          tokenContract.balanceOf(selectedAcc),
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals()
        ])

        const balance = formatUnits(balanceOf, decimals)
        token = {
          account: selectedAcc,
          address: tokenAddress,
          network: network?.id || '',
          balance,
          balanceRaw: balanceOf.toString(),
          tokenImageUrl: `${TOKEN_IMAGE_BASE_URL}${network?.id}/${tokenAddress}.png`,
          name,
          symbol,
          decimals
        }
      } catch (e) {
        // fail silently
      }

      return token
    },
    [network?.id, selectedAcc]
  )

  return { getTokenDetails }
}
