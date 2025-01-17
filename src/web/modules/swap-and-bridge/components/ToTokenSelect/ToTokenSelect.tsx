import { isAddress } from 'ethers'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SwapAndBridgeController } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import { getIsTokenEligibleForSwapAndBridgeToToken } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import CoinsIcon from '@common/assets/svg/CoinsIcon'
import StarFilledIcon from '@common/assets/svg/StarFilledIcon'
import { SectionedSelect } from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

interface Props {
  toTokenOptions: SelectValue[]
  toTokenValue: SelectValue
  toTokenAmountSelectDisabled: boolean
  handleChangeToToken: (value: SelectValue) => void
  addToTokenByAddressStatus: SwapAndBridgeController['statuses']['addToTokenByAddress']
  handleAddToTokenByAddress: (searchTerm: string) => void
}

const ToTokenSelect: React.FC<Props> = ({
  toTokenOptions,
  toTokenValue,
  toTokenAmountSelectDisabled,
  handleChangeToToken,
  addToTokenByAddressStatus,
  handleAddToTokenByAddress
}) => {
  const { t } = useTranslation()
  const { portfolio } = useSelectedAccountControllerState()
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

  const selectSections = useMemo(() => {
    const { toTokenOptionsInAccount, restToTokenOptions } = toTokenOptions.reduce<{
      toTokenOptionsInAccount: SelectValue[]
      restToTokenOptions: SelectValue[]
    }>(
      (acc, option) => {
        const isInPortfolioAndEligible = portfolio.tokens.some(
          (pt) =>
            pt.address === option.address &&
            pt.networkId === option.networkId &&
            getIsTokenEligibleForSwapAndBridgeToToken(pt)
        )

        isInPortfolioAndEligible
          ? acc.toTokenOptionsInAccount.push(option)
          : acc.restToTokenOptions.push(option)

        return acc
      },
      { toTokenOptionsInAccount: [], restToTokenOptions: [] }
    )

    return [
      {
        title: { icon: <CoinsIcon />, text: t('Tokens in the current account') },
        data: toTokenOptionsInAccount,
        key: 'swap-and-bridge-to-account-tokens'
      },
      {
        title: { icon: <StarFilledIcon />, text: t('Tokens') },
        data: restToTokenOptions,
        key: 'swap-and-bridge-to-service-provider-tokens'
      }
    ]
  }, [toTokenOptions, t, portfolio.tokens])

  const renderFeeOptionSectionHeader = useCallback(({ section }: any) => {
    if (section.data.length === 0 || !section.title) return null

    return (
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          spacings.ph,
          spacings.pt,
          section?.key === 'swap-and-bridge-to-account-tokens' ? spacings.pbSm : spacings.pbSm
          // TODO: Maybe?
          // section?.key === 'swap-and-bridge-to-service-provider-tokens' && {
          //   borderTopWidth: 1
          // }
        ]}
      >
        {section.title.icon}
        <Text style={spacings.mlMi} fontSize={14} weight="medium" appearance="secondaryText">
          {section.title.text}
        </Text>
      </View>
    )
  }, [])

  return (
    <SectionedSelect
      setValue={handleChangeToToken}
      sections={selectSections}
      renderSectionHeader={renderFeeOptionSectionHeader}
      value={toTokenValue}
      disabled={toTokenAmountSelectDisabled}
      testID="to-token-select"
      searchPlaceholder={t('Token name or address...')}
      menuLeftHorizontalOffset={285}
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
