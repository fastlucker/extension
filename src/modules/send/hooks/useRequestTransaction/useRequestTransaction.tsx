import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-native'

import useAccounts from '@modules/common/hooks/useAccounts'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { isKnownTokenOrContract, isValidAddress } from '@modules/common/services/address'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from '@modules/common/services/validate'
import { useNavigation, useRoute } from '@react-navigation/native'

const ERC20 = new Interface(erc20Abi)

export default function useRequestTransaction() {
  const { tokens, isBalanceLoading } = usePortfolio()
  const route: any = useRoute()
  const navigation: any = useNavigation()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { addToast } = useToast()
  const { isKnownAddress } = useAddressBook()
  const tokenAddressOrSymbol = route.params?.tokenAddressOrSymbol

  const tokenAddress = isValidAddress(tokenAddressOrSymbol)
    ? tokenAddressOrSymbol
    : tokens.find(({ symbol }: any) => symbol === tokenAddressOrSymbol)?.address || null
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState(tokenAddress)
  const [amount, setAmount] = useState<number>(0)
  const [address, setAddress] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [validationFormMgs, setValidationFormMgs] = useState({
    success: {
      amount: false,
      address: false
    },
    messages: {
      amount: '',
      address: ''
    }
  })

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

      // Timeout of 500ms because of the animated transition between screens (addRequest opens PendingTransactions screen)
      setTimeout(() => {
        setAsset('')
        setAmount(0)
        setAddress('')
      }, 500)
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }

  const unknownWarning = useMemo(
    () => isValidAddress(address) && !isKnownAddress(address),
    [address, isKnownAddress]
  )
  const smartContractWarning = useMemo(() => isKnownTokenOrContract(address), [address])

  useEffect(() => {
    if (!selectedAsset) return
    navigation.setParams({
      tokenAddressOrSymbol: +asset !== 0 ? asset : selectedAsset.symbol
    })
  }, [asset, selectedAsset])

  useEffect(() => {
    const isValidRecipientAddress = validateSendTransferAddress(
      address,
      selectedAcc,
      addressConfirmed,
      isKnownAddress
    )
    const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedAsset)

    setValidationFormMgs({
      success: {
        amount: isValidSendTransferAmount.success,
        address: isValidRecipientAddress.success
      },
      messages: {
        amount: isValidSendTransferAmount.message ? isValidSendTransferAmount.message : '',
        address: isValidRecipientAddress.message ? isValidRecipientAddress.message : ''
      }
    })

    setDisabled(!(isValidRecipientAddress.success && isValidSendTransferAmount.success))
  }, [address, amount, selectedAcc, selectedAsset, addressConfirmed, isKnownAddress])

  useEffect(() => {
    setAmount(0)
    setBigNumberHexAmount('')
  }, [asset])

  useEffect(() => {
    if (assetsItems.length && !asset) setAsset(assetsItems[0]?.value)
  }, [assetsItems])

  return {
    maxAmount,
    setMaxAmount,
    asset,
    selectedAsset,
    amount,
    address,
    setAsset,
    setAmount,
    setAddress,
    assetsItems,
    sendTransaction,
    isBalanceLoading,
    disabled,
    validationFormMgs,
    addressConfirmed,
    setAddressConfirmed,
    unknownWarning,
    smartContractWarning,
    onAmountChange
  }
}
