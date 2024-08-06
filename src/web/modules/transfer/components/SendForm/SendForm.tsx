import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Select from '@common/components/Select'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAddressInput from '@common/hooks/useAddressInput'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import { getInfoFromSearch } from '@web/contexts/transferControllerStateContext'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useTransferControllerState from '@web/hooks/useTransferControllerState'
import { mapTokenOptions } from '@web/utils/maps'
import { getTokenId } from '@web/utils/token'

import styles from './styles'

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: (
      <Text weight="medium" fontSize={14}>
        You don&apos;t have any tokens
      </Text>
    ),
    icon: null
  }
]

const getSelectProps = ({
  tokens,
  token,
  networks
}: {
  tokens: TokenResult[]
  token: string
  networks: Network[]
}) => {
  let options: any = []
  let value = null
  let amountSelectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens, networks)
    value = options.find((item: any) => item.value === token) || options[0]
    amountSelectDisabled = false
  }

  return {
    options,
    value,

    amountSelectDisabled
  }
}
const SendForm = ({
  addressInputState,
  isSmartAccount = false,
  amountErrorMessage,
  isRecipientAddressUnknown,
  isSWWarningVisible,
  isRecipientHumanizerKnownTokenOrSmartContract
}: {
  addressInputState: ReturnType<typeof useAddressInput>
  isSmartAccount: boolean
  amountErrorMessage: string
  isRecipientAddressUnknown: boolean
  isSWWarningVisible: boolean
  isRecipientHumanizerKnownTokenOrSmartContract: boolean
}) => {
  const { validation } = addressInputState
  const { state, tokens, transferCtrl } = useTransferControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const {
    maxAmount,
    maxAmountInFiat,
    amountFieldMode,
    amountInFiat,
    selectedToken,
    isSWWarningAgreed,
    isRecipientAddressUnknownAgreed,
    isTopUp,
    addressState,
    amount
  } = state
  const { t } = useTranslation()
  const { networks } = useNetworksControllerState()
  const { search } = useRoute()

  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  const {
    value: tokenSelectValue,
    options,
    amountSelectDisabled
  } = getSelectProps({
    tokens,
    token: selectedToken ? getTokenId(selectedToken) : '',
    networks
  })

  const disableForm = (!isSmartAccount && isTopUp) || !tokens.length

  const handleChangeToken = useCallback(
    (value: string) => {
      const tokenToSelect = tokens.find((tokenRes: TokenResult) => getTokenId(tokenRes) === value)

      transferCtrl.update({ selectedToken: tokenToSelect, amount: '' })
    },
    [tokens, transferCtrl]
  )

  const setAddressStateFieldValue = useCallback(
    (value: string) => {
      transferCtrl.update({ addressState: { fieldValue: value } })
    },
    [transferCtrl]
  )

  const setMaxAmount = useCallback(() => {
    transferCtrl.update({
      amount: amountFieldMode === 'token' ? maxAmount : maxAmountInFiat
    })
  }, [amountFieldMode, maxAmount, maxAmountInFiat, transferCtrl])

  const switchAmountFieldMode = useCallback(() => {
    transferCtrl.update({
      amountFieldMode: amountFieldMode === 'token' ? 'fiat' : 'token'
    })
  }, [amountFieldMode, transferCtrl])

  const setAmount = useCallback(
    (value: string) => {
      transferCtrl.update({ amount: value })
    },
    [transferCtrl]
  )

  const onRecipientAddressUnknownCheckboxClick = useCallback(() => {
    transferCtrl.update({
      isRecipientAddressUnknownAgreed: true
    })
  }, [transferCtrl])

  useEffect(() => {
    if (tokens?.length && !state.selectedToken) {
      let tokenToSelect = tokens[0]

      if (selectedTokenFromUrl) {
        const correspondingToken = tokens.find(
          (token) =>
            token.address === selectedTokenFromUrl.addr &&
            token.networkId === selectedTokenFromUrl.networkId &&
            token.flags.onGasTank === false
        )

        if (correspondingToken) {
          tokenToSelect = correspondingToken
        }
      }

      if (tokenToSelect && getTokenAmount(tokenToSelect) > 0) {
        transferCtrl.update({ selectedToken: tokenToSelect })
      }
    }
  }, [tokens, selectedTokenFromUrl, state.selectedToken, transferCtrl])

  return (
    <ScrollableWrapper
      contentContainerStyle={[styles.container, isTopUp ? styles.topUpContainer : {}]}
    >
      {(!state.selectedToken && tokens.length) || !accountPortfolio?.isAllReady ? (
        <View>
          <Text appearance="secondaryText" fontSize={14} weight="regular" style={spacings.mbMi}>
            {!accountPortfolio?.isAllReady
              ? t('Loading tokens...')
              : t(`Select ${isTopUp ? 'Gas Tank ' : ''}Token`)}
          </Text>
          <SkeletonLoader width="100%" height={50} style={spacings.mbLg} />
        </View>
      ) : (
        <Select
          setValue={({ value }) => handleChangeToken(value as string)}
          label={t(`Select ${isTopUp ? 'Gas Tank ' : ''}Token`)}
          options={options}
          value={tokenSelectValue}
          disabled={disableForm}
          containerStyle={styles.tokenSelect}
          testID="tokens-select"
        />
      )}
      <InputSendToken
        amount={amount}
        onAmountChange={setAmount}
        selectedTokenSymbol={selectedToken?.symbol || ''}
        errorMessage={amountErrorMessage}
        setMaxAmount={setMaxAmount}
        maxAmount={maxAmount}
        amountInFiat={amountInFiat}
        amountFieldMode={amountFieldMode}
        maxAmountInFiat={maxAmountInFiat}
        switchAmountFieldMode={switchAmountFieldMode}
        disabled={disableForm || amountSelectDisabled}
        isLoading={!accountPortfolio?.isAllReady}
        isSwitchAmountFieldModeDisabled={selectedToken?.priceIn.length === 0}
      />
      <View>
        {!isTopUp && (
          <Recipient
            disabled={disableForm}
            address={addressState.fieldValue}
            setAddress={setAddressStateFieldValue}
            validation={validation}
            uDAddress={addressState.udAddress}
            ensAddress={addressState.ensAddress}
            addressValidationMsg={validation.message}
            isRecipientHumanizerKnownTokenOrSmartContract={
              isRecipientHumanizerKnownTokenOrSmartContract
            }
            isRecipientAddressUnknown={isRecipientAddressUnknown}
            isRecipientDomainResolving={addressState.isDomainResolving}
            isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
            onRecipientAddressUnknownCheckboxClick={onRecipientAddressUnknownCheckboxClick}
            isSWWarningVisible={isSWWarningVisible}
            isSWWarningAgreed={isSWWarningAgreed}
            selectedTokenSymbol={selectedToken?.symbol}
          />
        )}
      </View>
    </ScrollableWrapper>
  )
}

export default React.memo(SendForm)
