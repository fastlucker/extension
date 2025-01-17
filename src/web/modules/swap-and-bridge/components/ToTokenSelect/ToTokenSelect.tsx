import { isAddress } from 'ethers'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { SwapAndBridgeController } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  toTokenOptions: SelectValue[]
  toTokenValue: SelectValue
  handleChangeToToken: (value: SelectValue) => void
  addToTokenByAddressStatus: SwapAndBridgeController['statuses']['addToTokenByAddress']
  handleAddToTokenByAddress: (searchTerm: string) => void
}

const ToTokenSelect: React.FC<Props> = ({
  toTokenOptions,
  toTokenValue,
  handleChangeToToken,
  addToTokenByAddressStatus,
  handleAddToTokenByAddress
}) => {
  const { t } = useTranslation()
  const [didAttemptSearchingTokenByAddress, setDidAttemptSearchingTokenByAddress] =
    React.useState(false)

  const handleAttemptToFetchMoreOptions = useCallback(
    (searchTerm: string) => {
      // Defer the state update to the next event loop iteration. This prevents the state
      // update from happening during the render phase of the parent which causes the warn:
      // Cannot update a component (ToTokenSelect) while rendering a different component (Select).
      setTimeout(() => setDidAttemptSearchingTokenByAddress(isAddress(searchTerm)), 100)

      return handleAddToTokenByAddress(searchTerm)
    },
    [handleAddToTokenByAddress]
  )

  const isAttemptingToAddToTokenByAddress = addToTokenByAddressStatus !== 'INITIAL'
  const notFoundPlaceholderText = didAttemptSearchingTokenByAddress
    ? t('Not found. Wrong receive network?') // TODO: Add "... or unsupported token" when UI allows longer messages
    : t('Not found. Try with token address?')

  return (
    <Select
      setValue={handleChangeToToken}
      options={toTokenOptions}
      value={toTokenValue}
      testID="to-token-select"
      searchPlaceholder={t('Token name or address...')}
      emptyListPlaceholderText={
        isAttemptingToAddToTokenByAddress ? t('Pulling token details...') : notFoundPlaceholderText
      }
      attemptToFetchMoreOptions={handleAttemptToFetchMoreOptions}
      containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
      selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0, ...spacings.phTy }}
    />
  )
}

export default React.memo(ToTokenSelect)
