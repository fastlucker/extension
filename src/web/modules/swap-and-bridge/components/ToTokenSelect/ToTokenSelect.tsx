import { isAddress } from 'ethers'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SwapAndBridgeController } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import CoinsIcon from '@common/assets/svg/CoinsIcon'
import StarFilledIcon from '@common/assets/svg/StarFilledIcon'
import { SectionedSelect } from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
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

  const selectSections = useMemo(() => {
    // TODO: No tokens case
    // if (!toTokenValue.length && !payOptionsPaidByEOA.length)
    //   return [
    //     {
    //       data: [NO_FEE_OPTIONS],
    //       key: 'no-options'
    //     }
    //   ]

    return [
      {
        title: {
          icon: <CoinsIcon />,
          text: t('Tokens in the current account')
        },
        data: toTokenOptions.filter((option) => option.isInAccPortfolio),
        key: 'swap-and-bridge-to-account-tokens'
      },
      {
        title: {
          icon: <StarFilledIcon />, // TODO: Different icon
          text: t('Tokens')
        },
        data: toTokenOptions.filter((option) => !option.isInAccPortfolio),
        key: 'swap-and-bridge-to-service-provider-tokens'
      }
    ]
  }, [toTokenOptions, t])

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
      testID="to-token-select"
      searchPlaceholder={t('Token name or address...')}
      emptyListPlaceholderText={
        isAttemptingToAddToTokenByAddress ? t('Pulling token details...') : notFoundPlaceholderText
      }
      attemptToFetchMoreOptions={handleAttemptToFetchMoreOptions}
      containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
      selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
    />
  )
}

export default React.memo(ToTokenSelect)
