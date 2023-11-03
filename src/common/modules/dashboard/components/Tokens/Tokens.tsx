import { formatUnits } from 'ethers'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'

import TokenDetails from './TokenDetails'
import TokenItem from './TokenItem'

interface Props {
  tokens: TokenResult[]
  searchValue: string
}

const calculateTokenBalance = ({ amount, decimals, priceIn }: TokenResult) => {
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const Tokens = ({ tokens, searchValue }: Props) => {
  const { t } = useTranslation()
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

  const handleSelectToken = ({ address, networkId, flags }: TokenResult) => {
    const token =
      tokens.find(
        (tokenI) =>
          tokenI.address === address &&
          tokenI.networkId === networkId &&
          tokenI.flags.onGasTank === flags.onGasTank
      ) || null

    setSelectedToken(token)
  }

  const handleTokenDetailsClose = () => {
    setSelectedToken(null)
  }

  return (
    <View>
      <TokenDetails token={selectedToken} handleClose={handleTokenDetailsClose} />

      <View style={spacings.mb}>
        {!sortedTokens.length && !searchValue && <Text>{t('No tokens yet')}</Text>}
        {!sortedTokens.length && searchValue && <Text>{t('No tokens found')}</Text>}
        {!!sortedTokens.length && (
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 8, paddingHorizontal: 8 }}>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={{ flex: 1.5 }}>
                ASSET/AMOUNT
              </Text>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={{ flex: 0.7 }}>
                PRICE
              </Text>
              <Text
                appearance="secondaryText"
                fontSize={14}
                weight="medium"
                style={{ flex: 0.8, textAlign: 'right' }}
              >
                USD VALUE
              </Text>
            </View>
            {sortedTokens.map(
              ({
                address,
                amount,
                decimals,
                networkId,
                priceIn,
                symbol,
                flags: { onGasTank, rewardsType, canTopUpGasTank, isFeeToken }
              }: TokenResult) => (
                <TokenItem
                  key={`${address}-${networkId}-${onGasTank ? 'gas-tank' : 'token'}`}
                  address={address}
                  amount={amount}
                  decimals={decimals}
                  networkId={networkId}
                  priceIn={priceIn}
                  symbol={symbol}
                  onGasTank={onGasTank}
                  rewardsType={rewardsType}
                  canTopUpGasTank={canTopUpGasTank}
                  isFeeToken={isFeeToken}
                  handleTokenSelect={handleSelectToken}
                />
              )
            )}
          </View>
        )}
      </View>

      {/* TODO: implementation of add custom token will be in sprint 4 */}
      <Button disabled type="secondary" text="+ Add Custom" />
    </View>
  )
}

export default Tokens
