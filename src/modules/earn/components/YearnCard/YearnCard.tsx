import { Interface } from 'ethers/lib/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { parseUnits } from '@ethersproject/units'
import networks from '@modules/common/constants/networks'
import YEARN_VAULT_ABI from '@modules/common/constants/YearnVaultABI'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import approveToken from '@modules/common/services/approveToken/approveToken'
import { getProvider } from '@modules/common/services/provider'
import Card from '@modules/earn/components/Card'
import { Yearn } from '@yfi/sdk'

const v2VaultsAddresses: any = [
  '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
  '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
  '0xdb25cA703181E7484a155DD612b06f57E12Be5F0',
  '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
  '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
  '0xB8C3B7A2A618C552C23B1E4701109a9E756Bab67',
  '0xe11ba472F74869176652C35D30dB89854b5ae84D',
  '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
  '0xFBEB78a723b8087fD2ea7Ef1afEc93d35E8Bed42',
  '0x6d765CbE5bC922694afE112C140b8878b9FB0390',
  '0xFD0877d9095789cAF24c98F7CCe092fa8E120775',
  '0xd9788f3931Ede4D5018184E198699dC6d66C1915'
]

const customVaultMetadata: any = {
  '0xa258C4606Ca8206D8aA700cE2143D7db854D168c': {
    displayName: 'WETH',
    displayIcon: 'https://etherscan.io/token/images/weth_28.png'
  }
}

const YearnVaultInterface = new Interface(YEARN_VAULT_ABI)

const YearnCard = () => {
  const currentNetwork = useRef()
  const [loading, setLoading] = useState<any>([])
  const [tokensItems, setTokensItems] = useState<any>([])
  const [details, setDetails] = useState<any>([])

  const { addToast } = useToast()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { tokens } = usePortfolio()

  const unavailable = network.id !== 'ethereum'
  const networkDetails: any = networks.find(({ id }) => id === network.id)
  const getTokenFromPortfolio = useCallback(
    (tokenAddress) =>
      tokens.find(({ address }: any) => address.toLowerCase() === tokenAddress.toLowerCase()) || {},
    [tokens]
  )
  const addRequestTxn = (id: any, txn: any, extraGas = 0) =>
    addRequest({
      id,
      type: 'eth_sendTransaction',
      chainId: networkDetails.chainId,
      account: selectedAcc,
      txn,
      extraGas
    })
  const provider = useMemo(() => getProvider(networkDetails.id), [networkDetails.id])

  const loadVaults = useCallback(async () => {
    if (unavailable) return
    const yearn = new Yearn(networkDetails.chainId, { provider })
    const v2Vaults = await yearn.vaults.get(v2VaultsAddresses)
    const vaults = v2Vaults.map(({ address, metadata, symbol, token, decimals }) => {
      const { apy, displayName, displayIcon }: any = {
        ...metadata,
        ...(customVaultMetadata[address] || {})
      }
      // eslint-disable-next-line no-unsafe-optional-chaining
      const formattedAPY = (apy?.net_apy * 100).toFixed(2) || 0

      return {
        vaultAddress: address,
        apy: formattedAPY,
        icon: displayIcon,
        value: address,
        token: {
          address: token,
          symbol: displayName,
          decimals
        },
        yToken: {
          address,
          symbol,
          decimals
        }
      }
    })

    const depositTokens = vaults.map((vault) => {
      const { apy, token } = vault
      const { address, symbol, decimals } = token
      const { balance, balanceRaw } = getTokenFromPortfolio(address)
      return {
        ...vault,
        type: 'deposit',
        label: `${symbol} (${apy}% APY)`,
        symbol,
        decimals,
        address: token.address,
        balance: balance || 0,
        balanceRaw: balanceRaw || '0'
      }
    })

    const withdrawTokens = vaults.map((vault) => {
      const { apy, yToken } = vault
      const { address, symbol, decimals } = yToken
      const { balance, balanceRaw } = getTokenFromPortfolio(address)
      return {
        ...vault,
        type: 'withdraw',
        label: `${symbol} (${apy}% APY)`,
        symbol,
        decimals,
        address: yToken.address,
        balance: balance || 0,
        balanceRaw: balanceRaw || '0'
      }
    })

    // Prevent race conditions
    if (currentNetwork.current !== networkDetails.id) return

    setTokensItems([...depositTokens, ...withdrawTokens])
  }, [getTokenFromPortfolio, provider, networkDetails, unavailable])

  const onTokenSelect = useCallback(
    (address) => {
      const selectedToken = tokensItems.find((t: any) => t.address === address)
      if (selectedToken)
        setDetails([
          ['Annual Percentage Yield (APY)', `${selectedToken.apy}%`],
          ['Lock', 'No Lock'],
          ['Type', 'Variable Rate']
        ])
    },
    [tokensItems]
  )

  const onValidate = async (type: any, value: any, amount: any) => {
    const item = tokensItems.find((t: any) => t.type === type.toLowerCase() && t.value === value)
    if (!item) return

    const { vaultAddress, decimals } = item
    const parsedAmount = amount.slice(0, amount.indexOf('.') + Number(decimals) + 1)
    const bigNumberAmount = parseUnits(parsedAmount, decimals)

    if (type === 'Deposit') {
      await approveToken(
        'Yearn Vault',
        network.id,
        selectedAcc,
        vaultAddress,
        item.address,
        addRequestTxn,
        addToast
      )

      try {
        addRequestTxn(`yearn_vault_deposit_${Date.now()}`, {
          to: vaultAddress,
          value: '0x0',
          data: YearnVaultInterface.encodeFunctionData('deposit', [
            bigNumberAmount.toHexString(),
            selectedAcc
          ])
        })
      } catch (e: any) {
        console.error(e)
        addToast(`Yearn Deposit Error: ${e.message || e}`, { error: true })
      }
    } else if (type === 'Withdraw') {
      try {
        addRequestTxn(`yearn_vault_withdraw_${Date.now()}`, {
          to: vaultAddress,
          value: '0x0',
          data: YearnVaultInterface.encodeFunctionData('withdraw', [
            bigNumberAmount.toHexString(),
            selectedAcc
          ])
        })
      } catch (e: any) {
        console.error(e)
        addToast(`Yearn Withdraw Error: ${e.message || e}`, { error: true })
      }
    }
  }

  useEffect(() => {
    async function load() {
      await loadVaults()
      setLoading(false)
    }
    load()
  }, [loadVaults])

  useEffect(() => {
    currentNetwork.current = network.id
    setLoading(true)
  }, [network?.id])

  return (
    <Card
      loading={loading}
      // icon={YEARN_ICON}
      unavailable={unavailable}
      tokensItems={tokensItems}
      details={details}
      onTokenSelect={onTokenSelect}
      onValidate={onValidate}
    />
  )
}

export default YearnCard
