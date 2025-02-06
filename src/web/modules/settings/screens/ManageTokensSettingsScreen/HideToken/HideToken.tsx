import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FlatList, View } from 'react-native'

import { TokenPreference } from '@ambire-common/libs/portfolio/customToken'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import HideTokenTokenItem from './TokenItem'

const HideToken = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { tokenPreferences, customTokens } = usePortfolioControllerState()
  const [initialTokenPreferences, setInitialTokenPreferences] = useState<TokenPreference[] | null>(
    null
  )
  const debouncedPortfolioUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const { portfolio: selectedAccountPortfolio } = useSelectedAccountControllerState()
  const { control, watch, setValue } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })

  const searchValue = watch('search')

  useEffect(() => {
    // Filter and sort using the initial lists to avoid re-ordering
    // the list changes
    if (!initialTokenPreferences) {
      setInitialTokenPreferences(tokenPreferences)
    }
  }, [customTokens, initialTokenPreferences, tokenPreferences])

  useEffect(() => {
    setValue('search', '')
  }, [setValue])

  const tokens = useMemo(
    () =>
      selectedAccountPortfolio?.tokens
        .filter((token) => {
          if (token.flags.onGasTank || !!token.flags.rewardsType) return false
          const isInitiallyInTokenPreferences = initialTokenPreferences?.find(
            ({ address, networkId }) => address === token.address && networkId === token.networkId
          )
          const isCustomToken = customTokens?.find(
            ({ address, networkId }) => address === token.address && networkId === token.networkId
          )

          return isInitiallyInTokenPreferences || isCustomToken
        })
        .filter((token) => {
          if (!searchValue) return true

          const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
          const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

          return doesAddressMatch || doesSymbolMatch
        })
        .sort((a, b) => {
          const aIsHidden =
            initialTokenPreferences?.find(
              ({ address, networkId }) => a.address === address && a.networkId === networkId
            )?.isHidden || false
          const bIsHidden =
            initialTokenPreferences?.find(
              ({ address, networkId }) => b.address === address && b.networkId === networkId
            )?.isHidden || false

          if (aIsHidden === bIsHidden) {
            const aIsCustom = customTokens?.find(
              ({ address, networkId }) => a.address === address && a.networkId === networkId
            )
            const bIsCustom = customTokens?.find(
              ({ address, networkId }) => b.address === address && b.networkId === networkId
            )

            if (aIsCustom && !bIsCustom) return -1
            if (!aIsCustom && bIsCustom) return 1

            return 0
          }

          if (aIsHidden && !bIsHidden) return 1
          if (!aIsHidden && bIsHidden) return -1

          return 0
        }),
    [selectedAccountPortfolio?.tokens, customTokens, initialTokenPreferences, searchValue]
  )

  const onTokenPreferenceOrCustomTokenChange = useCallback(() => {
    if (debouncedPortfolioUpdateInterval.current) {
      clearTimeout(debouncedPortfolioUpdateInterval.current)
    }

    debouncedPortfolioUpdateInterval.current = setTimeout(() => {
      dispatch({
        type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT_PORTFOLIO',
        params: {
          // Update the portfolio for all networks as the user may hide multiple tokens
          // from different networks
          forceUpdate: true
        }
      })
      debouncedPortfolioUpdateInterval.current = null
    }, 1000)
  }, [dispatch])

  const renderItem = useCallback(
    ({ item }: any) => (
      <HideTokenTokenItem
        onTokenPreferenceOrCustomTokenChange={onTokenPreferenceOrCustomTokenChange}
        {...item}
      />
    ),
    [onTokenPreferenceOrCustomTokenChange]
  )

  const keyExtractor = useCallback(
    (item: any) => `${item.address}-${item.networkId}-${item.flags?.isHidden}`,
    []
  )

  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Manage Tokens')}
      </Text>
      <Controller
        name="search"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('Token Address or Symbol')}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder={t('Input token address or symbol')}
          />
        )}
      />
      <FlatList
        data={tokens}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        onEndReachedThreshold={2.5}
        initialNumToRender={20}
        windowSize={9}
      />
    </View>
  )
}

export default React.memo(HideToken)
