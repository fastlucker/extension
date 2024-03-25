import { formatUnits } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'
import { View, ViewProps } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { PINNED_TOKENS } from '@ambire-common/consts/pinnedTokens'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import TokenDetails from './TokenDetails'
import TokenItem from './TokenItem'

interface Props extends ViewProps {
  tokens: TokenResult[]
  searchValue: string
  isLoading: boolean
  tokenPreferences: CustomToken[]
}

const calculateTokenBalance = ({ amount, decimals, priceIn }: TokenResult) => {
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const Tokens = ({ isLoading, tokens, searchValue, tokenPreferences, ...rest }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  // Filter out tokens which are not in
  // tokenPreferences and pinned
  const hasNonZeroTokensOrPreferences = tokens
    .filter(
      ({ address, amount }) =>
        !PINNED_TOKENS.find(
          (token) => token.address.toLowerCase() === address.toLowerCase() && token.amount > 0n
        ) &&
        !tokenPreferences.find(
          (token: CustomToken) => token.address.toLowerCase() === address.toLowerCase()
        ) &&
        amount > 0n
    )
    .some((token) => token.amount > 0n)

  const [selectedToken, setSelectedToken] = useState<TokenResult | null>(null)

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
        }),
    [tokens, hasNonZeroTokensOrPreferences, tokenPreferences]
  )

  const handleSelectToken = useCallback(
    ({ address, networkId, flags }: TokenResult) => {
      const token =
        tokens.find(
          (tokenI) =>
            tokenI.address === address &&
            tokenI.networkId === networkId &&
            tokenI.flags.onGasTank === flags.onGasTank
        ) || null
      setSelectedToken(token)
      openBottomSheet()
    },
    [openBottomSheet, tokens]
  )

  const handleTokenDetailsClose = () => {
    setSelectedToken(null)
  }

  return (
    <View {...rest}>
      <BottomSheet
        id="token-details"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        onClosed={handleTokenDetailsClose}
      >
        <TokenDetails token={selectedToken} handleClose={closeBottomSheet} />
      </BottomSheet>

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
              handleTokenSelect={handleSelectToken}
            />
          ))}
      </View>

      {/* TODO: implementation of add custom token will be in sprint 4 */}
      <Button
        type="secondary"
        text={t('+ Add Custom')}
        onPress={() => navigate(WEB_ROUTES.customTokens)}
      />
    </View>
  )
}

export default React.memo(Tokens)
