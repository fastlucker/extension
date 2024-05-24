import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { AddressState } from '@ambire-common/interfaces/domains'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAddressInput from '@common/hooks/useAddressInput'
import useRoute from '@common/hooks/useRoute'
import { getInfoFromSearch } from '@web/contexts/transferControllerStateContext'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { mapTokenOptions } from '@web/utils/maps'

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

const getTokenAddressAndNetworkFromId = (id: string) => {
  const [address, networkId, symbol] = id.split('-')
  return [address, networkId, symbol]
}

const getSelectProps = ({
  tokens,
  token,
  isTopUp,
  networks
}: {
  tokens: TokenResult[]
  token: string
  isTopUp: boolean
  networks: NetworkDescriptor[]
}) => {
  let options: any = []
  let value = null
  let tokenSelectDisabled = true
  let amountSelectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens, networks)
    value = options.find((item: any) => item.value === token) || options[0]
    tokenSelectDisabled = isTopUp
    amountSelectDisabled = false
  }

  return {
    options,
    value,
    tokenSelectDisabled,
    amountSelectDisabled
  }
}
const SendForm = ({
  isUpdatingLocalState,
  addressInputState,
  state,
  localAmount,
  setLocalAmount,
  localAddressState,
  setLocalAddressState,
  isAllReady = false,
  isSmartAccount = false,
  amountErrorMessage,
  isRecipientAddressUnknown,
  isSWWarningVisible,
  isRecipientHumanizerKnownTokenOrSmartContract
}: {
  isUpdatingLocalState: boolean
  addressInputState: ReturnType<typeof useAddressInput>
  state: TransferController
  localAmount: string
  setLocalAmount: React.Dispatch<React.SetStateAction<string>>
  localAddressState: AddressState
  setLocalAddressState: React.Dispatch<React.SetStateAction<AddressState>>
  isSmartAccount: boolean
  isAllReady?: boolean
  amountErrorMessage: string
  isRecipientAddressUnknown: boolean
  isSWWarningVisible: boolean
  isRecipientHumanizerKnownTokenOrSmartContract: boolean
}) => {
  const { dispatch } = useBackgroundService()
  const { validation } = addressInputState
  const { maxAmount, selectedToken, isSWWarningAgreed, isRecipientAddressUnknownAgreed, isTopUp } =
    state
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { search } = useRoute()

  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  const tokens = useMemo(
    () =>
      accountPortfolio?.tokens.filter(
        (token) => Number(getTokenAmount(token)) > 0 && !token.flags.onGasTank
      ) || [],
    [accountPortfolio]
  )

  const {
    value: tokenSelectValue,
    options,
    tokenSelectDisabled,
    amountSelectDisabled
  } = getSelectProps({
    tokens,
    token: `${selectedToken?.address}-${selectedToken?.networkId}-${selectedToken?.symbol}`,
    isTopUp,
    networks
  })

  const disableForm = (!isSmartAccount && isTopUp) || !tokens.length

  const handleChangeToken = useCallback(
    (value: string) => {
      const tokenToSelect = tokens.find(
        (tokenRes: TokenResult) =>
          tokenRes.address === getTokenAddressAndNetworkFromId(value)[0] &&
          tokenRes.networkId === getTokenAddressAndNetworkFromId(value)[1] &&
          tokenRes.symbol === getTokenAddressAndNetworkFromId(value)[2]
      )
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
        params: {
          selectedToken: tokenToSelect
        }
      })
      setLocalAmount('')
    },
    [dispatch, setLocalAmount, tokens]
  )

  const setLocalAddressFieldValue = useCallback(
    (value: string) => {
      setLocalAddressState((prev) => ({
        ...prev,
        fieldValue: value
      }))
    },
    [setLocalAddressState]
  )

  const setMaxAmount = useCallback(() => {
    setLocalAmount(maxAmount)
  }, [maxAmount, setLocalAmount])

  const onRecipientAddressUnknownCheckboxClick = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        isRecipientAddressUnknownAgreed: true
      }
    })
  }, [dispatch])

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
        dispatch({
          type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
          params: { selectedToken: tokenToSelect }
        })
      }
    }
  }, [tokens, selectedTokenFromUrl, state.selectedToken, dispatch])

  return (
    <ScrollableWrapper
      contentContainerStyle={[
        styles.container,
        isTopUp ? styles.topUpContainer : {},
        {
          opacity: isUpdatingLocalState ? 0 : 1
        }
      ]}
    >
      <Select
        setValue={({ value }) => handleChangeToken(value)}
        label={t('Select Token')}
        options={options}
        value={tokenSelectValue}
        disabled={tokenSelectDisabled || disableForm}
        containerStyle={styles.tokenSelect}
      />
      <InputSendToken
        amount={localAmount}
        onAmountChange={setLocalAmount}
        selectedTokenSymbol={isAllReady ? selectedToken?.symbol || t('Unknown') : ''}
        errorMessage={amountErrorMessage}
        setMaxAmount={setMaxAmount}
        maxAmount={!amountSelectDisabled ? Number(maxAmount) : null}
        disabled={disableForm}
      />
      <View>
        {!isTopUp && (
          <Recipient
            disabled={disableForm}
            address={localAddressState.fieldValue}
            setAddress={setLocalAddressFieldValue}
            validation={validation}
            uDAddress={localAddressState.udAddress}
            ensAddress={localAddressState.ensAddress}
            addressValidationMsg={validation.message}
            isRecipientHumanizerKnownTokenOrSmartContract={
              isRecipientHumanizerKnownTokenOrSmartContract
            }
            isRecipientAddressUnknown={isRecipientAddressUnknown}
            isRecipientDomainResolving={localAddressState.isDomainResolving}
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
