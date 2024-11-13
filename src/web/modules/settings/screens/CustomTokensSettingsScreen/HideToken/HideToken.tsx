import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FlatList, View } from 'react-native'

import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import HideTokenTokenItem from './TokenItem'

const HideToken = () => {
  const { t } = useTranslation()

  const portfolio = usePortfolioControllerState()
  const { portfolio: selectedAccountPortfolio } = useSelectedAccountControllerState()
  const [isLoading, setIsLoading] = useState<{
    [token: string]: boolean
  }>({})
  const [tokenPreferencesCopy, seTokenPreferencesCopy] = useState<CustomToken[]>([])

  const { control, watch, setValue } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })

  const searchValue = watch('search')

  useEffect(() => {
    setValue('search', '')
  }, [setValue])

  useEffect(() => {
    // Check for differences between the tokenPreferencesCopy and the tokenPreferences
    // If there are differences, update the tokenPreferencesCopy
    // Set the loading state of the token which is updated to false
    const differences = portfolio.state.tokenPreferences.filter(
      (tokenPreference) =>
        !tokenPreferencesCopy.some(
          (copy) =>
            copy.address === tokenPreference.address &&
            copy.networkId === tokenPreference.networkId &&
            copy.isHidden === tokenPreference.isHidden
        )
    )

    if (differences.length > 0) {
      seTokenPreferencesCopy(portfolio.state.tokenPreferences)
      setIsLoading((prevState) => {
        const updatedLoadingState = { ...prevState }
        differences.forEach((tokenPreference) => {
          updatedLoadingState[`${tokenPreference.address}-${tokenPreference.networkId}`] = false
        })
        return updatedLoadingState
      })
    }
  }, [portfolio.state.tokenPreferences, tokenPreferencesCopy])

  const tokens = useMemo(
    () =>
      selectedAccountPortfolio?.tokens
        .filter(
          (token) =>
            (token.amount > 0n ||
              portfolio.state.tokenPreferences.find(
                ({ address, networkId }) =>
                  token.address === address && token.networkId === networkId
              )) &&
            !token.flags.onGasTank &&
            !token.flags.rewardsType
        )
        .filter((token) => {
          if (!searchValue) return true

          const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
          const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

          return doesAddressMatch || doesSymbolMatch
        })
        .sort((a, b) => {
          const aFromPreferences = portfolio.state.tokenPreferences.some(
            ({ address, networkId, standard }) =>
              a.address.toLowerCase() === address.toLowerCase() &&
              a.networkId === networkId &&
              standard === 'ERC20'
          )
          const bFromPreferences = portfolio.state.tokenPreferences.some(
            ({ address, networkId, standard }) =>
              b.address.toLowerCase() === address.toLowerCase() &&
              b.networkId === networkId &&
              standard === 'ERC20'
          )
          if (aFromPreferences && !bFromPreferences) {
            return -1
          }
          if (!aFromPreferences && bFromPreferences) {
            return 1
          }

          return 0
        }),
    [selectedAccountPortfolio, portfolio.state.tokenPreferences, searchValue]
  )

  const renderItem = useCallback(
    ({ item }: any) => (
      <HideTokenTokenItem
        token={item}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        seTokenPreferencesCopy={seTokenPreferencesCopy}
      />
    ),
    [isLoading]
  )

  const keyExtractor = useCallback((item: any) => `${item.address}-${item.networkId}`, [])

  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Hide Token')}
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
