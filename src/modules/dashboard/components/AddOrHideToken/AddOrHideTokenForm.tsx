import ERC20ABI from 'adex-protocol-eth/abi/ERC20'
import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { Token, UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio'
import { isValidAddress } from 'ambire-common/src/services/address'
import { Contract } from 'ethers'
import { formatUnits, Interface } from 'ethers/lib/utils'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Spinner from '@modules/common/components/Spinner'
import useToast from '@modules/common/hooks/useToast'
import { rpcProviders } from '@modules/common/services/providers'
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
  tokens: UsePortfolioReturnType['tokens']
  extraTokens: UsePortfolioReturnType['extraTokens']
  hiddenTokens: UsePortfolioReturnType['hiddenTokens']
  networkId?: NetworkId
  networkName?: NetworkType['name']
  selectedAcc: UseAccountsReturnType['selectedAcc']
}

const AddOrHideTokenForm: React.FC<Props> = ({
  mode,
  onSubmit,
  enableSymbolSearch = false,
  tokens,
  extraTokens,
  hiddenTokens,
  networkId,
  networkName,
  selectedAcc
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenDetails, setTokenDetails] = useState<any>(null)
  const [showError, setShowError] = useState<string>('')
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
    networkId === 'binance-smart-chain'
      ? 'a BEP20'
      : networkId === 'ethereum'
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
        setShowError(
          t(
            "The address/symbol you entered does not appear to correspond to you assets list or it's already hidden."
          ) as string
        )
      }
    }

    if (!isValidAddress(inputText)) return

    setLoading(true)
    setShowError('')

    try {
      const provider = networkId && rpcProviders[networkId]
      const tokenContract = new Contract(inputText, ERC20Interface, provider)

      const [balanceOf, name, symbol, decimals] = await Promise.all([
        tokenContract.balanceOf(selectedAcc),
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals()
      ])

      const isAlreadyHandled = (mode === MODES.ADD_TOKEN ? extraTokens : hiddenTokens).find(
        (token) => token.address === inputText
      )
      if (isAlreadyHandled) {
        setShowError(
          mode === MODES.ADD_TOKEN
            ? (t('The address you entered is already added.') as string)
            : (t('The address/symbol you entered is already hidden.') as string)
        )
      } else {
        const balance = formatUnits(balanceOf, decimals)
        setTokenDetails({
          account: selectedAcc,
          address: inputText.toLowerCase(),
          network: networkId,
          balance,
          balanceRaw: balanceOf.toString(),
          tokenImageUrl: `https://storage.googleapis.com/zapper-fi-assets/tokens/${networkId}/${inputText}.png`,
          name,
          symbol,
          decimals
        })
      }
    } catch (e) {
      addToast('Failed to load token info', { error: true })
      setShowError(
        t(
          'The address you entered does not appear to correspond to {{tokenStandard}} token on {{networkName}}.',
          { tokenStandard, networkName }
        ) as string
      )
    }

    setLoading(false)
  }

  const handleOnPress = handleSubmit(() => {
    onSubmit(tokenDetails, mode)
    reset()
    setTokenDetails(null)
    setShowError('')
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
            error={showError}
          />
        )}
        name="address"
      />

      {loading && (
        <View style={spacings.mb}>
          <Spinner />
        </View>
      )}

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
