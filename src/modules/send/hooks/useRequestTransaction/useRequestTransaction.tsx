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
import usePrevious from '@modules/common/hooks/usePrevious'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'

const ERC20 = new Interface(erc20Abi)

export default function useRequestTransaction() {
  const isFocused = useIsFocused()
  const { tokens, isCurrNetworkBalanceLoading } = usePortfolio()
  const route: any = useRoute()
  const navigation: any = useNavigation()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { addToast } = useToast()
  const { isKnownAddress } = useAddressBook()
  const tokenAddressOrSymbol = route.params?.tokenAddressOrSymbol
  const prevNetworkId = usePrevious(network.id)
  const timer: any = useRef(null)
  const tokenAddress = isValidAddress(tokenAddressOrSymbol)
    ? tokenAddressOrSymbol
    : tokens.find(({ symbol }: any) => symbol === tokenAddressOrSymbol)?.address || null
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState(tokenAddress)
  const [amount, setAmount] = useState<number>(0)
  const [address, setAddress] = useState('')
  const [uDAddress, setUDAddress] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [sWAddressConfirmed, setSWAddressConfirmed] = useState(false)
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

  const selectedAsset = useMemo(
    () => tokens.find(({ address }: any) => address === asset),
    [tokens, asset]
  )

  // Needed for the cases when the network is changed from another screen
  // In this case a state update doesn't work
  // but setting a flag in a ref and updating the state when screen is focused works just fine
  const shouldUpdate = useRef(false)
  useEffect(() => {
    if (prevNetworkId && network.id !== prevNetworkId) {
      shouldUpdate.current = true
    }
  }, [prevNetworkId, network.id])

  // Update the selected asset in the token selector after the screen is being focused
  useEffect(() => {
    if (isFocused && shouldUpdate.current) {
      setAsset(tokens[0]?.address)
      shouldUpdate.current = false
    }
  }, [isFocused])

  // TODO: setting the list of deps doesn't trigger a proper asset update
  // should be fixed
  useEffect(() => {
    if (!selectedAsset && !!tokens && tokens?.[0]?.address !== asset) {
      setAsset(tokens[0]?.address)
    }
  })

  useEffect(() => {
    if (!selectedAsset) return
    navigation.setParams({
      tokenAddressOrSymbol: +asset !== 0 ? asset : selectedAsset.symbol
    })
  }, [selectedAsset, asset])

  useEffect(() => {
    const addrOrSymbol = route.params?.tokenAddressOrSymbol
    const addr = isValidAddress(addrOrSymbol)
      ? addrOrSymbol
      : tokens.find(({ symbol }: any) => symbol === addrOrSymbol)?.address || null
    if (addr) {
      setAsset(addr)
    }
  }, [route.params?.tokenAddressOrSymbol, tokens])

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
        setAsset('')
        setAmount(0)
        setAddress('')
      }, 500)
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }, [selectedAcc, address, selectedAsset, bigNumberHexAmount, network?.chainId, uDAddress])

  const unknownWarning = useMemo(() => {
    const addr = uDAddress || address
    return isValidAddress(addr) && !isKnownAddress(addr)
  }, [address, uDAddress, isKnownAddress])

  const smartContractWarning = useMemo(() => isKnownTokenOrContract(address), [address])

  const showSWAddressWarning = useMemo(
    () =>
      !!tokenAddress &&
      Number(tokenAddress) === 0 &&
      networks
        .map(({ id }) => id)
        .filter((id) => id !== 'ethereum')
        .includes(network.id),
    [tokenAddress, network]
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
    isCurrNetworkBalanceLoading
  }
}
