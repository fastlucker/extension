import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import networks from 'ambire-common/src/constants/networks'
import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { resolveUDomain } from 'ambire-common/src/services/unstoppableDomains'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from 'ambire-common/src/services/validations'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import TokenIcon from '@modules/common/components/TokenIcon'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'

const ERC20 = new Interface(erc20Abi)

export default function useRequestTransaction() {
  const isFocused = useIsFocused()
  const { tokens, isCurrNetworkBalanceLoading, dataLoaded } = usePortfolio()
  const { params }: any = useRoute()
  const navigation: any = useNavigation()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { addToast } = useToast()
  const { isKnownAddress } = useAddressBook()
  const timer: any = useRef(null)
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [address, setAddress] = useState('')
  const [uDAddress, setUDAddress] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [sWAddressConfirmed, setSWAddressConfirmed] = useState(false)
  const [validationFormMgs, setValidationFormMgs] = useState<{
    success: {
      amount: boolean
      address: boolean
    }
    messages: {
      amount: string | null
      address: string | null
    }
  }>({
    success: {
      amount: false,
      address: false
    },
    messages: {
      amount: '',
      address: ''
    }
  })
  // <Select items={assetsItems} />
  const assetsItems = useMemo(
    () =>
      tokens.map(({ label, symbol, address, img, tokenImageUrl }: any) => ({
        label: label || symbol,
        value: address,
        icon: () => (
          <TokenIcon
            uri={img || tokenImageUrl}
            networkId={network.id}
            address={selectedAcc}
            withContainer
          />
        )
      })),
    [tokens, selectedAcc, network.id]
  )

  // returns the whole token object of the selected asset
  const selectedAsset = useMemo(
    () => tokens.find(({ address }: any) => address === asset),
    [tokens, asset]
  )

  useEffect(() => {
    if (!selectedAsset && !!tokens && tokens?.[0]?.address !== asset) {
      setAsset(tokens[0]?.address)
    }
  }, [selectedAsset, tokens, asset])

  useEffect(() => {
    if (params?.tokenAddressOrSymbol) {
      const addrOrSymbol = params?.tokenAddressOrSymbol
      const addr = isValidAddress(addrOrSymbol)
        ? addrOrSymbol
        : tokens.find(({ symbol }: any) => symbol === addrOrSymbol)?.address || null
      if (addr) {
        setAsset(addr)
      }
      navigation.setParams({
        tokenAddressOrSymbol: undefined
      })
    }
  }, [params?.tokenAddressOrSymbol, tokens])

  const maxAmount = useMemo(() => {
    if (!selectedAsset) return 0
    const { balanceRaw, decimals } = selectedAsset
    return ethers.utils.formatUnits(balanceRaw, decimals)
  }, [selectedAsset])

  const onAmountChange = useCallback(
    (value: any) => {
      if (value) {
        const { decimals } = selectedAsset
        const bigNumberAmount = ethers.utils.parseUnits(value, decimals).toHexString()
        setBigNumberHexAmount(bigNumberAmount)
      }

      setAmount(value)
    },
    [selectedAsset]
  )

  const setMaxAmount = useCallback(() => onAmountChange(maxAmount), [onAmountChange, maxAmount])

  const sendTransaction = useCallback(() => {
    try {
      const recipientAddress = uDAddress || address

      const txn = {
        to: selectedAsset.address,
        value: '0',
        data: ERC20.encodeFunctionData('transfer', [recipientAddress, bigNumberHexAmount])
      }

      if (Number(selectedAsset.address) === 0) {
        txn.to = recipientAddress
        txn.value = bigNumberHexAmount
        txn.data = '0x'
      }

      const req: any = {
        id: `transfer_${Date.now()}`,
        type: 'eth_sendTransaction',
        chainId: network?.chainId,
        account: selectedAcc,
        txn,
        meta: null
      }

      if (uDAddress) {
        req.meta = {
          addressLabel: {
            addressLabel: address,
            address: uDAddress
          }
        }
      }

      addRequest(req)

      // Timeout of 500ms because of the animated transition between screens (addRequest opens PendingTransactions screen)
      setTimeout(() => {
        setAsset(null)
        setAmount(0)
        setAddress('')
      }, 500)
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }, [selectedAcc, address, selectedAsset, bigNumberHexAmount, network?.chainId, uDAddress])

  const unknownWarning = useMemo(() => {
    if (uDAddress) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, isKnownAddress])

  useEffect(() => {
    if (uDAddress && !unknownWarning && validationFormMgs.messages?.address) {
      setValidationFormMgs((prev) => ({
        ...prev,
        messages: {
          amount: prev.messages.amount,
          address: null
        }
      }))
    }
  }, [unknownWarning, uDAddress, validationFormMgs.messages?.address])

  const smartContractWarning = useMemo(() => isKnownTokenOrContract(address), [address])

  const showSWAddressWarning = useMemo(
    () =>
      !!selectedAsset?.address &&
      Number(selectedAsset?.address) === 0 &&
      networks
        .map(({ id }) => id)
        .filter((id) => id !== 'ethereum')
        .includes(network.id),
    [selectedAsset?.address, network]
  )

  useEffect(() => {
    if (isFocused) {
      const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedAsset)

      if (address.startsWith('0x') && address.indexOf('.') === -1) {
        if (uDAddress !== '') setUDAddress('')
        const isValidRecipientAddress = validateSendTransferAddress(
          address,
          selectedAcc,
          addressConfirmed,
          isKnownAddress
        )

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

        setDisabled(
          !isValidRecipientAddress.success ||
            !isValidSendTransferAmount.success ||
            (showSWAddressWarning && !sWAddressConfirmed)
        )
      } else {
        if (timer.current) {
          clearTimeout(timer.current)
        }

        const validateForm = async () => {
          const UDAddress = await resolveUDomain(
            address,
            selectedAsset ? selectedAsset.symbol : null,
            network.unstoppableDomainsChain
          )
          timer.current = null
          const isUDAddress = !!UDAddress
          const isValidRecipientAddress = validateSendTransferAddress(
            UDAddress || address,
            selectedAcc,
            addressConfirmed,
            isKnownAddress,
            isUDAddress
          )

          setUDAddress(UDAddress)
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

          setDisabled(
            !isValidRecipientAddress.success ||
              !isValidSendTransferAmount.success ||
              (showSWAddressWarning && !sWAddressConfirmed)
          )
        }

        timer.current = setTimeout(async () => {
          return validateForm().catch(console.error)
        }, 300)
      }
    }
    return () => clearTimeout(timer.current)
  }, [
    address,
    amount,
    selectedAcc,
    selectedAsset,
    addressConfirmed,
    showSWAddressWarning,
    sWAddressConfirmed,
    isKnownAddress,
    addToast,
    network.id,
    uDAddress,
    network.unstoppableDomainsChain,
    isFocused
  ])

  useEffect(() => {
    setAmount(0)
    setBigNumberHexAmount('')
  }, [asset])

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
    disabled,
    validationFormMgs,
    addressConfirmed,
    setAddressConfirmed,
    unknownWarning,
    smartContractWarning,
    onAmountChange,
    showSWAddressWarning,
    sWAddressConfirmed,
    setSWAddressConfirmed,
    uDAddress,
    isLoading: isCurrNetworkBalanceLoading && !dataLoaded
  }
}
