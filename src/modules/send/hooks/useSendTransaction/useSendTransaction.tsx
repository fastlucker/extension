import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-native'

import useAccounts from '@modules/common/hooks/useAccounts'
import useInternalRequests from '@modules/common/hooks/useInternalRequests'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { isValidAddress } from '@modules/common/services/address'

const ERC20 = new Interface(erc20Abi)

export default function useSendTransaction(route: any, navigation: any) {
  const { tokens } = usePortfolio()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useInternalRequests()
  const tokenAddressOrSymbol = route.params?.tokenAddressOrSymbol

  const tokenAddress = isValidAddress(tokenAddressOrSymbol)
    ? tokenAddressOrSymbol
    : tokens.find(({ symbol }: any) => symbol === tokenAddressOrSymbol)?.address || null
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState(tokenAddress)
  const [amount, setAmount] = useState<number>(0)
  const [address, setAddress] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const selectedAsset = tokens.find(({ address }: any) => address === asset)

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const assetsItems = tokens.map(({ label, symbol, address, img, tokenImageUrl }: any) => ({
    label: label || symbol,
    value: address,
    icon: () => <Image source={{ uri: img || tokenImageUrl }} style={{ width: 30, height: 30 }} />
  }))

  const maxAmount = useMemo(() => {
    if (!selectedAsset) return 0
    const { balanceRaw, decimals } = selectedAsset
    return ethers.utils.formatUnits(balanceRaw, decimals)
  }, [selectedAsset])

  const onAmountChange = (value: any) => {
    if (value) {
      const { decimals } = selectedAsset
      const bigNumberAmount = ethers.utils.parseUnits(value, decimals).toHexString()
      setBigNumberHexAmount(bigNumberAmount)
    }

    setAmount(value)
  }

  const setMaxAmount = () => onAmountChange(maxAmount)

  const sendTransaction = () => {
    try {
      const txn = {
        to: selectedAsset.address,
        value: '0',
        data: ERC20.encodeFunctionData('transfer', [address, bigNumberHexAmount])
      }

      if (Number(selectedAsset.address) === 0) {
        txn.to = address
        txn.value = bigNumberHexAmount
        txn.data = '0x'
      }

      addRequest({
        id: `transfer_${Date.now()}`,
        type: 'eth_sendTransaction',
        chainId: network?.chainId,
        account: selectedAcc,
        txn
      })

      setAmount(0)
    } catch (e: any) {
      console.error(e)
      // TODO: set global error message
      // addToast(`Error: ${e.message || e}`, { error: true })
    }
  }

  useEffect(() => {
    if (!selectedAsset) return
    navigation.setParams({
      tokenAddressOrSymbol: +asset !== 0 ? asset : selectedAsset.symbol
    })
  }, [asset, selectedAsset])

  useEffect(() => {
    setAmount(0)
    setBigNumberHexAmount('')
  }, [asset])

  useEffect(() => {
    if (assetsItems.length && !asset) setAsset(assetsItems[0]?.value)
  }, [assetsItems])

  return {
    setMaxAmount,
    asset,
    amount,
    address,
    setAsset,
    setAmount,
    setAddress,
    assetsItems,
    sendTransaction
  }
}
