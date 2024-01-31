import { formatUnits } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'
import { View, ViewProps } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import TokenDetails from './TokenDetails'
import TokenItem from './TokenItem'

interface Props extends ViewProps {
  tokens: TokenResult[]
  searchValue: string
}

const calculateTokenBalance = ({ amount, decimals, priceIn }: TokenResult) => {
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const Tokens = ({ tokens, searchValue, ...rest }: Props) => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const [selectedToken, setSelectedToken] = useState<TokenResult | null>(null)

  const sortedTokens = useMemo(
    () =>
      tokens.sort((a, b) => {
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
          if (aBalance === 0 && bBalance !== 0) {
            return 1
          }
          if (aBalance !== 0 && bBalance === 0) {
            return -1
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
    [tokens]
  )

  const handleSelectToken = useCallback(
    () =>
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
              <Text fontSize={16} weight="medium">
                {t('No tokens yet')}
              </Text>
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
      <Button disabled type="secondary" text="+ Add Custom" />
    </View>
  )
}

export default React.memo(Tokens)
