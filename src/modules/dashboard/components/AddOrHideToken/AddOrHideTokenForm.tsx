import ERC20ABI from 'adex-protocol-eth/abi/ERC20'
import { Token } from 'ambire-common/src/hooks/usePortfolio'
import { isValidAddress } from 'ambire-common/src/services/address'
import { Contract, getDefaultProvider } from 'ethers'
import { formatUnits, Interface } from 'ethers/lib/utils'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'

import { MODES } from './constants'
import TokenItem from './TokenItem'

const ERC20Interface = new Interface(ERC20ABI)

const ADDRESS_LENGTH = 42
const TOKEN_SYMBOL_MIN_LENGTH = 3

interface Props {
  mode: MODES
  onSubmit: (token: Token, formMode: MODES) => void
  enableSymbolSearch?: boolean
}

const AddOrHideTokenForm: React.FC<Props> = ({ mode, onSubmit, enableSymbolSearch = false }) => {
  const { t } = useTranslation()
  const { selectedAcc: account } = useAccounts()
  const { network }: any = useNetwork()
  const { tokens, hiddenTokens } = usePortfolio()
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenDetails, setTokenDetails] = useState<any>(null)
  const [showError, setShowError] = useState<boolean>(false)
  const { addToast } = useToast()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      address: ''
    }
  })

  const disabled = !tokenDetails || !(tokenDetails.symbol && tokenDetails.decimals)

  const tokenStandard =
    // eslint-disable-next-line no-nested-ternary
    network?.id === 'binance-smart-chain'
      ? 'a BEP20'
      : network?.id === 'ethereum'
      ? 'an ERC20'
      : 'a valid'

  const onInput = async (_inputText: string) => {
    let inputText = _inputText
    setTokenDetails(null)

    if (inputText.length === ADDRESS_LENGTH && !isValidAddress(inputText))
      return addToast(`Invalid address: ${inputText}`, { error: true })

    if (enableSymbolSearch) {
      const foundByAddressOrSymbol = tokens.find(
        (i) =>
          i.symbol.toLowerCase() === inputText.toLowerCase() ||
          i.address.toLowerCase() === inputText.toLowerCase()
      )

      if (foundByAddressOrSymbol) {
        inputText = foundByAddressOrSymbol?.address
      } else if (inputText.length >= TOKEN_SYMBOL_MIN_LENGTH) {
        setShowError(true)
      }
    }

    if (!isValidAddress(inputText)) return

    setLoading(true)
    setShowError(false)

    try {
      const provider = getDefaultProvider(network.rpc)
      const tokenContract = new Contract(inputText, ERC20Interface, provider)

      const [balanceOf, name, symbol, decimals] = await Promise.all([
        tokenContract.balanceOf(account),
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals()
      ])

      const isAlreadyHandled = (mode === MODES.ADD_TOKEN ? tokens : hiddenTokens).find(
        (token) => token.address === inputText
      )
      if (isAlreadyHandled) {
        setShowError(true)
      } else {
        const balance = formatUnits(balanceOf, decimals)
        setTokenDetails({
          account,
          address: inputText,
          network: network.id,
          balance,
          balanceRaw: balanceOf.toString(),
          tokenImageUrl: `https://storage.googleapis.com/zapper-fi-assets/tokens/${network.id}/${inputText}.png`,
          name,
          symbol,
          decimals
        })
      }
    } catch (e) {
      addToast('Failed to load token info', { error: true })
      setShowError(true)
    }

    setLoading(false)
  }

  const handleOnPress = handleSubmit(() => {
    onSubmit(tokenDetails, mode)
    reset()
    setTokenDetails(null)
    setShowError(false)
  })

  return (
    <>
      <Controller
        control={control}
        rules={enableSymbolSearch ? undefined : { validate: isValidAddress }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={enableSymbolSearch ? t('Token Address or Symbol') : t('Token Address')}
            placeholder={t('0x...')}
            autoFocus
            onBlur={onBlur}
            onChangeText={(text: string) => {
              onInput(text)
              return onChange(text)
            }}
            value={value}
            error={
              showError &&
              (enableSymbolSearch
                ? (t(
                    'The address/symbol you entered does not appear to correspond to you assets list or its already hidden.'
                  ) as string)
                : (t(
                    'The address you entered does not appear to correspond to {{tokenStandard}} token on {{networkName}}.',
                    { tokenStandard, networkName: network?.name }
                  ) as string))
            }
          />
        )}
        name="address"
      />

      {loading && <ActivityIndicator style={spacings.mb} />}

      {!showError && tokenDetails && <TokenItem {...tokenDetails} />}

      <Button
        text={isSubmitting ? t('Adding...') : t('Add')}
        disabled={isSubmitting || disabled}
        onPress={handleOnPress}
      />
    </>
  )
}

export default AddOrHideTokenForm
