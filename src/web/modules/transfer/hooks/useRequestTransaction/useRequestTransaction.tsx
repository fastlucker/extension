import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import { TokenResult } from 'ambire-common/src/libs/portfolio/interfaces'
import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { getBip44Items, resolveENSDomain } from 'ambire-common/src/services/ensDomains'
import { resolveUDomain } from 'ambire-common/src/services/unstoppableDomains'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from 'ambire-common/src/services/validations'
import { formatUnits, Interface, parseUnits } from 'ethers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import networks from '@common/constants/networks'
import useConstants from '@common/hooks/useConstants'
import useIsScreenFocused from '@common/hooks/useIsScreenFocused/useIsScreenFocused'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { mapTokenOptions } from '@web/modules/sign-account-op/screens/SignAccountOpScreen/SignAccountOpScreen'

const ERC20 = new Interface(erc20Abi)

const addRequest = (req: any) => console.log(req)
// @TODO: get from AddressBook
const isKnownAddress = (addr: string) => addr === 'always-false'

export default function useRequestTransaction() {
  const isFocused = useIsScreenFocused()
  const {
    accountPortfolio: { tokens, isAllReady: isCurrNetworkBalanceLoading }
  } = usePortfolioControllerState()
  const { params } = useRoute()
  const navigation = useNavigation()
  const { selectedAccount: selectedAcc } = useMainControllerState()

  const { addToast } = useToast()
  const { constants } = useConstants()
  const timer: any = useRef(null)
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const [asset, setAsset] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
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

  const assetsItems = mapTokenOptions(tokens as TokenResult[])

  // returns the whole token object of the selected asset
  const selectedAsset = useMemo(
    () =>
      tokens.find(
        ({ address: selectedAssetAddress }: TokenResult) => selectedAssetAddress === asset
      ),
    [tokens, asset]
  )
  const selectedAssetNetwork = useMemo(
    () => networks.find(({ id }) => id === selectedAsset?.networkId),
    [selectedAsset?.networkId]
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

      // Clears the param so that it doesn't get cached (used) again
      // @ts-ignore-next-line
      navigation.setParams({
        tokenAddressOrSymbol: undefined
      })
    }
  }, [params?.tokenAddressOrSymbol, tokens, navigation])

  const maxAmount = useMemo(() => {
    if (!selectedAsset) return 0
    const { amount: selectedAssetAmount, decimals } = selectedAsset
    return formatUnits(selectedAssetAmount, decimals)
  }, [selectedAsset])

  const onAmountChange = useCallback(
    (value: any) => {
      if (value && selectedAsset) {
        const { decimals } = selectedAsset
        // @TODO: non-existant .toHexString method was used here
        const bigNumberAmount = parseUnits(value, decimals).toString()
        setBigNumberHexAmount(bigNumberAmount)
      }

      setAmount(value)
    },
    [selectedAsset]
  )

  const setMaxAmount = useCallback(() => onAmountChange(maxAmount), [onAmountChange, maxAmount])

  const sendTransaction = useCallback(() => {
    try {
      const recipientAddress = uDAddress || ensAddress || address

      if (!selectedAsset || !selectedAssetNetwork) return

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
        chainId: selectedAssetNetwork.chainId,
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
      } else if (ensAddress) {
        req.meta = {
          addressLabel: {
            addressLabel: address,
            address: ensAddress
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
  }, [selectedAcc, address, selectedAsset, bigNumberHexAmount, uDAddress, ensAddress, addToast])

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
    if (isFocused && selectedAsset) {
      const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedAsset)

      if (address.startsWith('0x') && address.indexOf('.') === -1) {
        if (uDAddress !== '') setUDAddress('')
        if (ensAddress !== '') setEnsAddress('')
        const isValidRecipientAddress = validateSendTransferAddress(
          address,
          selectedAcc,
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
            selectedAcc,
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
    selectedAcc,
    selectedAsset,
    addressConfirmed,
    showSWAddressWarning,
    sWAddressConfirmed,
    addToast,
    uDAddress,
    ensAddress,
    isFocused,
    constants
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
    ensAddress,
    isLoading: isCurrNetworkBalanceLoading && !tokens
  }
}
