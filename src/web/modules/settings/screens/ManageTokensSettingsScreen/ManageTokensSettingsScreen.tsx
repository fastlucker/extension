import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { TokenResult } from '@ambire-common/libs/portfolio'
import { TokenPreference } from '@ambire-common/libs/portfolio/customToken'
import { SelectValue } from '@common/components/Select/types'
import flexbox from '@common/styles/utils/flexbox'
import { tokenSearch } from '@common/utils/search'
import { networkSort } from '@common/utils/sorting'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import AddTokenBottomSheet from './AddTokenBottomSheet'
import Filters from './Filters'
import Header from './Header'
import TokenSection from './TokenSection'

const ManageTokensSettingsScreen = () => {
  const debouncedPortfolioUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const {
    ref: addTokenBottomSheetRef,
    open: openAddTokenBottomSheet,
    close: closeAddTokenBottomSheet
  } = useModalize()
  const { dispatch } = useBackgroundService()
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { control, watch } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const { networks } = useNetworksControllerState()
  const {
    portfolio: { isAllReady, tokens }
  } = useSelectedAccountControllerState()
  const [networkFilter, setNetworkFilter] = useState('all')
  const search = watch('search')
  // Instead of waiting for the portfolio to update remove the token immediately
  const [optimisticRemovedTokens, setOptimisticRemovedTokens] = useState<
    Pick<TokenResult, 'address' | 'networkId'>[]
  >([])
  const [optimisticTokenPreferences, setOptimisticTokenPreferences] = useState<TokenPreference[]>(
    []
  )

  useEffect(() => {
    setCurrentSettingsPage('manage-tokens')
  }, [setCurrentSettingsPage])

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const { flags, networkId, address } = token
      if (flags.onGasTank || !!flags.rewardsType) return false
      if (networkFilter !== 'all' && networkId !== networkFilter) return false

      const isRemoved = optimisticRemovedTokens.some(
        ({ address: addr, networkId: nId }) => addr === address && nId === networkId
      )
      if (isRemoved) return false

      return tokenSearch({ search, token, networks })
    })
  }, [networkFilter, networks, optimisticRemovedTokens, search, tokens])

  const customTokens = useMemo(() => {
    return filteredTokens
      .filter(({ flags, address, networkId }) => {
        const isTokenHidden =
          !optimisticTokenPreferences.some(
            ({ address: addr, networkId: nId, isHidden }) =>
              addr === address && nId === networkId && !isHidden
          ) && flags.isHidden

        return flags.isCustom && !isTokenHidden
      })
      .sort((a, b) => {
        const aNetwork = networks.find(({ id }) => id === a.networkId)
        const bNetwork = networks.find(({ id }) => id === b.networkId)

        if (!aNetwork || !bNetwork) return 0

        return networkSort(aNetwork, bNetwork, networks)
      })
  }, [filteredTokens, networks, optimisticTokenPreferences])

  const hiddenTokens = useMemo(() => {
    return filteredTokens
      .filter(({ flags, address, networkId }) => {
        return (
          !optimisticTokenPreferences.some(
            ({ address: addr, networkId: nId, isHidden }) =>
              addr === address && nId === networkId && !isHidden
          ) && flags.isHidden
        )
      })
      .sort((a, b) => {
        const aNetwork = networks.find(({ id }) => id === a.networkId)
        const bNetwork = networks.find(({ id }) => id === b.networkId)

        if (!aNetwork || !bNetwork) return 0

        return networkSort(aNetwork, bNetwork, networks)
      })
  }, [filteredTokens, networks, optimisticTokenPreferences])

  const isLoading = useMemo(() => !isAllReady, [isAllReady])

  const setNetworkFilterValue = useCallback(({ value }: SelectValue) => {
    if (typeof value !== 'string') return

    setNetworkFilter(value)
  }, [])

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

  const onTokenRemove = useCallback(
    ({ address, networkId }: Pick<TokenResult, 'address' | 'networkId'>) => {
      setOptimisticRemovedTokens((prev) => [...prev, { address, networkId }])
    },
    []
  )

  const onTokenUnhide = useCallback(
    ({ address, networkId }: Pick<TokenResult, 'address' | 'networkId'>) => {
      setOptimisticTokenPreferences((prev) => [...prev, { address, networkId, isHidden: false }])
    },
    [setOptimisticTokenPreferences]
  )

  const handleCloseAddTokenBottomSheet = useCallback(() => {
    setOptimisticRemovedTokens([])
    closeAddTokenBottomSheet()
  }, [closeAddTokenBottomSheet])

  return (
    <View style={flexbox.flex1}>
      <AddTokenBottomSheet
        sheetRef={addTokenBottomSheetRef}
        handleClose={handleCloseAddTokenBottomSheet}
      />
      <Header openAddTokenBottomSheet={openAddTokenBottomSheet} />
      <Filters
        control={control}
        networkFilter={networkFilter}
        setNetworkFilterValue={setNetworkFilterValue}
      />
      <View style={flexbox.flex1}>
        <TokenSection
          variant="custom"
          isLoading={isLoading}
          data={customTokens}
          onTokenPreferenceOrCustomTokenChange={onTokenPreferenceOrCustomTokenChange}
          onTokenRemove={onTokenRemove}
          onTokenUnhide={onTokenUnhide}
          networkFilter={networkFilter}
          search={search}
        />
        <TokenSection
          variant="hidden"
          isLoading={isLoading}
          data={hiddenTokens}
          onTokenPreferenceOrCustomTokenChange={onTokenPreferenceOrCustomTokenChange}
          onTokenRemove={onTokenRemove}
          onTokenUnhide={onTokenUnhide}
          networkFilter={networkFilter}
          search={search}
        />
      </View>
    </View>
  )
}

export default ManageTokensSettingsScreen
