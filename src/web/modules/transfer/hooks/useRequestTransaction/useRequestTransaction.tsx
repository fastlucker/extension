import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import { formatUnits, Interface, parseUnits } from 'ethers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { isKnownTokenOrContract, isValidAddress } from '@ambire-common/services/address'
import { getBip44Items, resolveENSDomain } from '@ambire-common/services/ensDomains'
import { resolveUDomain } from '@ambire-common/services/unstoppableDomains'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from '@ambire-common/services/validations'
import networks from '@common/constants/networks'
import useConstants from '@common/hooks/useConstants'
import useIsScreenFocused from '@common/hooks/useIsScreenFocused/useIsScreenFocused'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getTokenAddressAndNetworkFromId } from '@web/utils/maps'

const ERC20 = new Interface(erc20Abi)

// @TODO: get from AddressBook
const isKnownAddress = (addr: string) => addr === 'always-false'

const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  // Remove the search params from the url
  window.history.replaceState(null, '', `${window.location.pathname}#/transfer`)

  return `${params.get('address')}-${params.get('networkId')}`
}

const DEFAULT_VALIDATION_FORM_MSGS = {
  success: {
    amount: false,
    address: false
  },
  messages: {
    amount: '',
    address: ''
  }
}

export default function useRequestTransaction() {
  const isFocused = useIsScreenFocused()
  const {
    accountPortfolio: { tokens, isAllReady: isCurrNetworkBalanceLoading }
  } = usePortfolioControllerState()
  const { search } = useRoute()
  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])
  const { selectedAccount } = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { constants } = useConstants()
  const timer: any = useRef(null)
  const [asset, setAsset] = useState<string | null>(() => {
    if (!selectedTokenFromUrl && tokens?.length > 0)
      return `${tokens[0].address}-${tokens[0].networkId}`
    if (!selectedTokenFromUrl && !tokens) return null

    return selectedTokenFromUrl
  })
  const [amount, setAmount] = useState<string>('0')
  const [address, setAddress] = useState('')
  const [uDAddress, setUDAddress] = useState('')
  const [ensAddress, setEnsAddress] = useState('')
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
  }>(DEFAULT_VALIDATION_FORM_MSGS)

  const selectedAsset = useMemo(() => {
    if (!asset) return tokens[0]

    const [selectedAssetAddress, selectedAssetNetworkId] = getTokenAddressAndNetworkFromId(asset)

    return tokens.find(
      ({ address: tokenAddress, networkId: tokenNetworkId }) =>
        tokenAddress === selectedAssetAddress && tokenNetworkId === selectedAssetNetworkId
    )
  }, [asset, tokens])

  const selectedAssetNetwork = useMemo(
    () => networks.find(({ id }) => id === selectedAsset?.networkId),
    [selectedAsset?.networkId]
  )

  const maxAmount = useMemo(() => {
    if (!selectedAsset) return '0'
    const { amount: selectedAssetAmount, decimals } = selectedAsset
    return formatUnits(selectedAssetAmount, decimals)
  }, [selectedAsset])

  const onAmountChange = useCallback((value: string) => {
    setAmount(value)
  }, [])

  const setMaxAmount = useCallback(() => onAmountChange(maxAmount), [onAmountChange, maxAmount])

  const sendTransaction = useCallback(async () => {
    try {
      const recipientAddress = uDAddress || ensAddress || address

      if (!selectedAsset || !selectedAssetNetwork || !selectedAccount) return

      const bigNumberHexAmount = `0x${parseUnits(amount, selectedAsset.decimals).toString(16)}`

      const txn = {
        kind: 'call' as const,
        to: selectedAsset.address,
        value: BigInt(0),
        data: ERC20.encodeFunctionData('transfer', [recipientAddress, bigNumberHexAmount])
      }

      if (Number(selectedAsset.address) === 0) {
        txn.to = recipientAddress
        txn.value = BigInt(bigNumberHexAmount)
        txn.data = '0x'
      }

      const req: UserRequest = {
        id: new Date().getTime(),
        networkId: selectedAssetNetwork.id,
        accountAddr: selectedAccount,
        forceNonce: null,
        action: txn
      }

      // @TODO: delete the console.log when /sign-account-op is ready
      console.log(req)
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: req
      }).then(() => {
        setAsset(`${tokens[0].address}-${tokens[0].networkId}`)
        setAddress('')
        setAmount('0')
        setEnsAddress('')
        setUDAddress('')
        setSWAddressConfirmed(false)
        setAddressConfirmed(false)
        setValidationFormMgs(DEFAULT_VALIDATION_FORM_MSGS)
        setDisabled(true)
      })
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }, [
    uDAddress,
    ensAddress,
    address,
    selectedAsset,
    selectedAssetNetwork,
    selectedAccount,
    amount,
    tokens,
    dispatch,
    addToast
  ])

  const unknownWarning = useMemo(() => {
    if (uDAddress || ensAddress) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, ensAddress])

  const smartContractWarning = useMemo(
    () => isKnownTokenOrContract(constants!.humanizerInfo, address),
    [address, constants]
  )

  const showSWAddressWarning = useMemo(
    () =>
      !!selectedAsset?.address &&
      Number(selectedAsset?.address) === 0 &&
      networks
        .map(({ id }) => id)
        .filter((id) => id !== 'ethereum')
        .includes(selectedAssetNetwork?.id || 'ethereum'),
    [selectedAsset?.address, selectedAssetNetwork]
  )

  useEffect(() => {
    if ((uDAddress || ensAddress) && !unknownWarning && validationFormMgs.messages?.address) {
      setValidationFormMgs((prev) => ({
        success: {
          amount: prev.success.amount,
          address: true
        },
        messages: {
          amount: prev.messages.amount,
          address: null
        }
      }))
      setDisabled(
        !validationFormMgs.success.amount || (showSWAddressWarning && !sWAddressConfirmed)
      )
    }
  }, [
    unknownWarning,
    uDAddress,
    ensAddress,
    validationFormMgs.messages?.address,
    validationFormMgs.success.amount,
    sWAddressConfirmed,
    showSWAddressWarning
  ])

  useEffect(() => {
    if (isFocused && selectedAsset && (address || uDAddress || ensAddress)) {
      const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedAsset)

      if (address.startsWith('0x') && address.indexOf('.') === -1) {
        if (uDAddress !== '') setUDAddress('')
        if (ensAddress !== '') setEnsAddress('')
        const isValidRecipientAddress = validateSendTransferAddress(
          address,
          selectedAccount,
          addressConfirmed,
          isKnownAddress,
          constants!.humanizerInfo
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
          const UDAddress = selectedAssetNetwork
            ? await resolveUDomain(
                address,
                selectedAsset ? selectedAsset.symbol : null,
                selectedAssetNetwork.unstoppableDomainsChain
              )
            : null
          const bip44Item = getBip44Items(selectedAsset ? selectedAsset.symbol : null)
          const ensAddr = await resolveENSDomain(address, bip44Item)

          timer.current = null
          const isUDAddress = !!UDAddress
          const isEnsAddress = !!ensAddr
          const isValidRecipientAddress = validateSendTransferAddress(
            UDAddress || ensAddr || address,
            selectedAccount,
            addressConfirmed,
            isKnownAddress,
            constants!.humanizerInfo,
            isUDAddress,
            isEnsAddress
          )

          setUDAddress(UDAddress)
          setEnsAddress(ensAddr)
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
    return () => clearTimeout(timer?.current)
  }, [
    address,
    amount,
    selectedAccount,
    addressConfirmed,
    showSWAddressWarning,
    sWAddressConfirmed,
    addToast,
    uDAddress,
    ensAddress,
    isFocused,
    constants,
    selectedAssetNetwork,
    selectedAsset
  ])

  useEffect(() => {
    setAmount('0')
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
    ensAddress,
    isLoading: isCurrNetworkBalanceLoading && !tokens
  }
}
