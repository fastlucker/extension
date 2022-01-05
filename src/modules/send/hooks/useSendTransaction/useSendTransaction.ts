import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import usePortfolio from '@modules/common/hooks/usePortfolio'
import { isValidAddress } from '@modules/common/services/address'

export default function useSendTransaction(route: any, navigation: any) {
  const { tokens } = usePortfolio()
  const tokenAddressOrSymbol = route.params?.tokenAddressOrSymbol

  const tokenAddress = isValidAddress(tokenAddressOrSymbol)
    ? tokenAddressOrSymbol
    : tokens.find(({ symbol }: any) => symbol === tokenAddressOrSymbol)?.address || null
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState(tokenAddress)
  const [amount, setAmount] = useState<number>(0)

  const selectedAsset = tokens.find(({ address }: any) => address === asset)

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
  return { setMaxAmount, asset, amount, setAsset, setAmount }
}
