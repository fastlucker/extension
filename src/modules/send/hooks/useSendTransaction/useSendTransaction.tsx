import { ethers } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-native'

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

  return { setMaxAmount, asset, amount, address, setAsset, setAmount, setAddress, assetsItems }
}
