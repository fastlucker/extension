import { formatUnits } from 'ethers'
import React, { useCallback, useEffect, useMemo } from 'react'
import { View, ViewProps } from 'react-native'

import { PINNED_TOKENS } from '@ambire-common/consts/pinnedTokens'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

import TokenItem from './TokenItem'

interface Props extends ViewProps {
  tokens: TokenResult[]
  searchValue: string
  isLoading: boolean
  tokenPreferences: CustomToken[]
  page: number
  maxPages: number
  setMaxPages: React.Dispatch<React.SetStateAction<number>>
}

const { isPopup } = getUiType()

const calculateTokenBalance = ({ amount, decimals, priceIn }: TokenResult) => {
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const TOKENS_PER_PAGE = isPopup ? 25 : 50

const Tokens = ({
  isLoading,
  tokens,
  searchValue,
  tokenPreferences,
  page,
  maxPages,
  setMaxPages,
  ...rest
}: Props) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  // Filter out tokens which are not in
  // tokenPreferences and pinned
  const hasNonZeroTokensOrPreferences = useMemo(
    () =>
      tokens
        .filter(
          ({ address, amount }) =>
            !PINNED_TOKENS.find(
              (pinnedToken) =>
                pinnedToken.address.toLowerCase() === address.toLowerCase() && amount > 0n
            ) &&
            !tokenPreferences.find(
              (token: CustomToken) => token.address.toLowerCase() === address.toLowerCase()
            ) &&
            amount > 0n
        )
        .some((token) => token.amount > 0n),
    [tokenPreferences, tokens]
  )

  const sortedTokens = useMemo(
    () =>
      tokens
        .filter(
          (token) =>
            token.amount > 0n ||
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
              return Number(b.amount) - Number(a.amount)
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
        })
        .filter((_, index) => index < page * TOKENS_PER_PAGE),
    [tokens, page, tokenPreferences, hasNonZeroTokensOrPreferences]
  )

  const navigateToAddCustomToken = useCallback(() => {
    navigate(WEB_ROUTES.customTokens)
  }, [navigate])

  useEffect(() => {
    setMaxPages(Math.ceil(tokens.length / TOKENS_PER_PAGE))
  }, [setMaxPages, tokens.length])

  return (
    <View {...rest}>
      <View style={[spacings.mb]}>
        {!sortedTokens.length && (
          <View style={[flexbox.alignCenter, spacings.pv]}>
            {!searchValue && (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <Text fontSize={16} weight="medium" style={isLoading && spacings.mrTy}>
                  {isLoading ? t('Looking for tokens') : t('No tokens yet')}
                </Text>
                {!!isLoading && <Spinner style={{ width: 16, height: 16 }} />}
              </View>
            )}
            {!!searchValue && (
              <Text fontSize={16} weight="medium">
                {t('No tokens found')}
              </Text>
            )}
          </View>
        )}
        {!!sortedTokens.length &&
          sortedTokens.map((token: TokenResult) => (
            <TokenItem
              key={`${token?.address}-${token?.networkId}-${
                token?.flags?.onGasTank ? 'gas-tank' : ''
              }${token?.flags?.rewardsType ? 'rewards' : ''}${
                !token?.flags?.onGasTank && !token?.flags?.rewardsType ? 'token' : ''
              }`}
              token={token}
              tokenPreferences={tokenPreferences}
              // handleTokenSelect={handleSelectToken}
            />
          ))}
      </View>

      {page === maxPages ? (
        <Button type="secondary" text={t('+ Add Custom')} onPress={navigateToAddCustomToken} />
      ) : (
        <Spinner
          style={{
            marginVertical: 24,
            alignSelf: 'center',
            width: 24,
            height: 24
          }}
        />
      )}
    </View>
  )
}

export default React.memo(Tokens)
