import { formatUnits } from 'ethers'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FlatListProps, View } from 'react-native'

import { PINNED_TOKENS } from '@ambire-common/consts/pinnedTokens'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import DashboardBanners from '../DashboardBanners'
import DashboardPageScrollContainer from '../DashboardPageScrollContainer'
import TabsAndSearch from '../TabsAndSearch'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
import TokenItem from './TokenItem'
import Skeleton from './TokensSkeleton'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  filterByNetworkId: NetworkDescriptor['id']
  tokenPreferences: CustomToken[]
  initTab?: {
    [key: string]: boolean
  }
  onScroll: FlatListProps<any>['onScroll']
}

// if any of the post amount (during simulation) or the current state
// has a balance above 0, we should consider it legit and show it
const hasAmount = (token: TokenResult) => {
  return token.amount > 0n || (token.amountPostSimulation && token.amountPostSimulation > 0n)
}

const calculateTokenBalance = (token: TokenResult) => {
  const amount = getTokenAmount(token)
  const { decimals, priceIn } = token
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const { isPopup } = getUiType()

const Tokens = ({
  filterByNetworkId,
  tokenPreferences,
  openTab,
  setOpenTab,
  initTab,
  onScroll
}: Props) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()
  const { accountPortfolio } = usePortfolioControllerState()
  const { control, watch, setValue } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })

  const searchValue = watch('search')

  const tokens = useMemo(
    () =>
      (accountPortfolio?.tokens || [])
        .filter((token) => {
          if (!filterByNetworkId) return true
          if (filterByNetworkId === 'rewards') return token.flags.rewardsType
          if (filterByNetworkId === 'gasTank') return token.flags.onGasTank

          return token.networkId === filterByNetworkId
        })
        .filter((token) => {
          if (!searchValue) return true

          const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
          const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

          return doesAddressMatch || doesSymbolMatch
        }),
    [accountPortfolio?.tokens, filterByNetworkId, searchValue]
  )

  // Filter out tokens which are not in
  // tokenPreferences and pinned
  const hasNonZeroTokensOrPreferences = useMemo(
    () =>
      tokens
        .filter(
          (tokenRes) =>
            !PINNED_TOKENS.find(
              (pinnedToken) =>
                pinnedToken.address.toLowerCase() === tokenRes.address.toLowerCase() &&
                hasAmount(tokenRes)
            ) &&
            !tokenPreferences.find(
              (token: CustomToken) => token.address.toLowerCase() === tokenRes.address.toLowerCase()
            ) &&
            hasAmount(tokenRes)
        )
        .some(hasAmount),
    [tokenPreferences, tokens]
  )

  const sortedTokens = useMemo(
    () =>
      tokens
        .filter(
          (token) =>
            hasAmount(token) ||
            tokenPreferences.find(
              ({ address, networkId }) =>
                token.address.toLowerCase() === address.toLowerCase() &&
                token.networkId === networkId
            ) ||
            (!hasNonZeroTokensOrPreferences &&
              PINNED_TOKENS.find(
                ({ address, networkId }) =>
                  token.address.toLowerCase() === address.toLowerCase() &&
                  token.networkId === networkId
              ))
        )
        .filter((token) => !token.isHidden)
        .sort((a, b) => {
          // pending tokens go on top
          if (
            typeof a.amountPostSimulation === 'bigint' &&
            a.amountPostSimulation !== BigInt(a.amount)
          ) {
            return -1
          }
          if (
            typeof b.amountPostSimulation === 'bigint' &&
            b.amountPostSimulation !== BigInt(b.amount)
          ) {
            return 1
          }

          // If a is a rewards token and b is not, a should come before b.
          if (a.flags.rewardsType && !b.flags.rewardsType) {
            return -1
          }
          if (!a.flags.rewardsType && b.flags.rewardsType) {
            // If b is a rewards token and a is not, b should come before a.
            return 1
          }

          const aBalance = calculateTokenBalance(a)
          const bBalance = calculateTokenBalance(b)

          if (a.flags.rewardsType === b.flags.rewardsType) {
            if (aBalance === bBalance) {
              return Number(getTokenAmount(b)) - Number(getTokenAmount(a))
            }

            return bBalance - aBalance
          }

          if (a.flags.onGasTank && !b.flags.onGasTank) {
            return -1
          }
          if (!a.flags.onGasTank && b.flags.onGasTank) {
            return 1
          }

          return 0
        }),
    [tokens, tokenPreferences, hasNonZeroTokensOrPreferences]
  )

  const navigateToAddCustomToken = useCallback(() => {
    navigate(WEB_ROUTES.customTokens)
  }, [navigate])

  const renderItem = useCallback(
    ({ item, index }: any) => {
      if (item === 'header') {
        return (
          <View style={{ backgroundColor: theme.primaryBackground }}>
            <TabsAndSearch openTab={openTab} setOpenTab={setOpenTab} searchControl={control} />
            <View style={[flexbox.directionRow, spacings.mbTy, spacings.phTy]}>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={{ flex: 1.5 }}>
                {t('ASSET/AMOUNT')}
              </Text>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={{ flex: 0.7 }}>
                {t('PRICE')}
              </Text>
              <Text
                appearance="secondaryText"
                fontSize={14}
                weight="medium"
                style={{ flex: 0.8, textAlign: 'right' }}
              >
                {t('USD VALUE')}
              </Text>
            </View>
          </View>
        )
      }

      if (item === 'empty') {
        return (
          <View style={[flexbox.alignCenter, spacings.pv]}>
            <Text fontSize={16} weight="medium">
              {!searchValue && !filterByNetworkId && t("You don't have any tokens yet")}
              {!searchValue && filterByNetworkId && t("You don't have any tokens on this network")}
              {searchValue && t('No tokens found')}
            </Text>
          </View>
        )
      }

      if (item === 'skeleton')
        return (
          <View style={spacings.ptTy}>
            {/* Display more skeleton items if there are no tokens */}
            <Skeleton amount={sortedTokens.length ? 3 : 5} withHeader={false} />
          </View>
        )

      if (item === 'footer') {
        return accountPortfolio?.isAllReady &&
          // A trick to render the button once all tokens have been rendered. Otherwise
          // there will be layout shifts
          index === sortedTokens.length + 3 ? (
          <Button
            type="secondary"
            text={t('+ Add Custom Token')}
            onPress={navigateToAddCustomToken}
            style={spacings.mtSm}
          />
        ) : null
      }

      if (!initTab?.tokens || !item || item === 'keep-this-to-avoid-key-warning') return null

      return <TokenItem token={item} tokenPreferences={tokenPreferences} />
    },
    [
      sortedTokens.length,
      initTab?.tokens,
      tokenPreferences,
      theme.primaryBackground,
      openTab,
      setOpenTab,
      control,
      t,
      searchValue,
      accountPortfolio?.isAllReady,
      navigateToAddCustomToken
    ]
  )

  const keyExtractor = useCallback((tokenOrElement: any) => {
    if (typeof tokenOrElement === 'string') {
      return tokenOrElement
    }

    const token = tokenOrElement

    return `${token?.address}-${token?.networkId}-${token?.flags?.onGasTank ? 'gas-tank' : ''}${
      token?.flags?.rewardsType ? 'rewards' : ''
    }${!token?.flags?.onGasTank && !token?.flags?.rewardsType ? 'token' : ''}`
  }, [])

  useEffect(() => {
    setValue('search', '')
  }, [setValue])

  return (
    <DashboardPageScrollContainer
      tab="tokens"
      openTab={openTab}
      ListHeaderComponent={<DashboardBanners />}
      data={[
        'header',
        ...(initTab?.tokens ? sortedTokens : []),
        !sortedTokens.length && accountPortfolio?.isAllReady ? 'empty' : '',
        !accountPortfolio?.isAllReady ? 'skeleton' : 'keep-this-to-avoid-key-warning',
        'footer'
      ]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={isPopup ? 5 : 2.5}
      initialNumToRender={isPopup ? 10 : 20}
      windowSize={9} // Larger values can cause performance issues.
      onScroll={onScroll}
    />
  )
}

export default React.memo(Tokens)
