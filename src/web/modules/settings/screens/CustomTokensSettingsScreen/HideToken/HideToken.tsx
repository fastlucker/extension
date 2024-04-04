import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

const HideToken = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const portfolio = usePortfolioControllerState()
  const [isLoading, setIsLoading] = useState<any>({})
  const [tokenPreferencesCopy, seTokenPreferencesCopy] = useState<CustomToken[]>([])

  const hideToken = useCallback(
    async (token: CustomToken) => {
      const tokenPreferences = portfolio.state.tokenPreferences

      let tokenIsInPreferences = tokenPreferences.find(
        (tokenPreference) =>
          tokenPreference.address.toLowerCase() === token.address.toLowerCase() &&
          tokenPreference.networkId === token.networkId
      )

      // Flip isHidden flag
      if (!tokenIsInPreferences) {
        tokenIsInPreferences = { ...token, isHidden: true }
      } else {
        tokenIsInPreferences = { ...tokenIsInPreferences, isHidden: !tokenIsInPreferences.isHidden }
      }

      let newTokenPreferences = []

      if (!tokenIsInPreferences) {
        newTokenPreferences.push(token)
      } else {
        const updatedTokenPreferences = tokenPreferences.map((_t: any) => {
          if (
            _t.address.toLowerCase() === token.address.toLowerCase() &&
            _t.networkId === token.networkId
          ) {
            return tokenIsInPreferences
          }
          return _t
        })
        newTokenPreferences = updatedTokenPreferences
      }

      seTokenPreferencesCopy(newTokenPreferences)
      setIsLoading({ [`${token.address}-${token.networkId}`]: true })

      await portfolio.updateTokenPreferences(tokenIsInPreferences)
    },
    [portfolio]
  )

  const removeToken = useCallback(
    async (token: CustomToken) => {
      await portfolio.removeTokenPreferences(token)
    },
    [portfolio]
  )

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
      portfolio.accountPortfolio?.tokens
        .filter(
          (token) =>
            (token.amount > 0n ||
              portfolio.state.tokenPreferences.find(
                ({ address, networkId }) =>
                  token.address === address && token.networkId === networkId
              )) &&
            !token.flags.onGasTank
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
    [portfolio.accountPortfolio?.tokens, portfolio.state.tokenPreferences, searchValue]
  )

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
      <View>
        {(tokens &&
          tokens.length &&
          tokens.map((token) => (
            <View
              key={`${token.address}-${token.networkId}`}
              style={[
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.justifySpaceBetween,
                spacings.phTy,
                spacings.pvTy,
                spacings.mbTy
              ]}
            >
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <TokenIcon
                  containerHeight={32}
                  containerWidth={32}
                  width={22}
                  height={22}
                  withContainer
                  networkId={token.networkId}
                  address={token.address}
                />
                <Text fontSize={16} style={spacings.mlTy} weight="semiBold">
                  {token.symbol}
                </Text>
              </View>
              <View style={flexbox.directionRow}>
                {portfolio.state.tokenPreferences.find(
                  ({ address, networkId, standard }) =>
                    token.address.toLowerCase() === address.toLowerCase() &&
                    token.networkId === networkId &&
                    standard === 'ERC20'
                ) && (
                  <Pressable onPress={() => removeToken(token)}>
                    <DeleteIcon
                      color={theme.secondaryText}
                      style={[spacings.phTy, { cursor: 'pointer' }]}
                    />
                  </Pressable>
                )}
                {portfolio.state.tokenPreferences.find(
                  ({ address, networkId }) =>
                    token.address.toLowerCase() === address.toLowerCase() &&
                    token.networkId === networkId
                )?.isHidden ? (
                  <Pressable
                    disabled={isLoading[`${token.address}-${token.networkId}`]}
                    onPress={() => hideToken(token)}
                  >
                    <VisibilityIcon
                      color={theme.successDecorative}
                      style={[spacings.phTy, { cursor: 'pointer' }]}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    disabled={isLoading[`${token.address}-${token.networkId}`]}
                    onPress={() => hideToken(token)}
                  >
                    <InvisibilityIcon
                      color={theme.errorDecorative}
                      style={[spacings.phTy, { cursor: 'pointer' }]}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ))) ||
          null}
      </View>
    </View>
  )
}

export default React.memo(HideToken)
