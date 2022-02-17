import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { FontAwesome5 } from '@expo/vector-icons'
import Panel from '@modules/common/components/Panel'
import Select from '@modules/common/components/Select'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import {
  getFeePaymentConsequences,
  isTokenEligible,
  mapTxnErrMsg
} from '@modules/pending-transactions/services/helpers'

import styles from './styles'

const SPEEDS = ['slow', 'medium', 'fast', 'ape']

const FeeSelector = ({
  disabled,
  signer,
  estimation,
  setEstimation,
  feeSpeed,
  setFeeSpeed
}: any) => {
  const { t } = useTranslation()
  const { network }: any = useNetwork()
  const [currency, setCurrency] = useState<any>(null)

  useEffect(() => {
    if (estimation?.selectedFeeToken?.symbol && currency !== estimation?.selectedFeeToken?.symbol) {
      setCurrency(estimation?.selectedFeeToken?.symbol)
    }
  }, [currency, estimation?.selectedFeeToken?.symbol])

  useEffect(() => {
    if (currency) {
      const tokens = estimation.remainingFeeTokenBalances || [
        { symbol: network.nativeAssetSymbol, decimals: 18 }
      ]
      const token = tokens.find(({ symbol }: any) => symbol === currency)
      setEstimation({ ...estimation, selectedFeeToken: token })
    }
  }, [currency])

  const renderFeeSelector = () => {
    if (!estimation) return <ActivityIndicator />

    // Only check for insufficient fee in relayer mode (.feeInUSD is available)
    // Otherwise we don't care whether the user has enough for fees, their signer wallet will take care of it
    const insufficientFee =
      estimation &&
      estimation.feeInUSD &&
      !isTokenEligible(estimation.selectedFeeToken, feeSpeed, estimation)
    if (estimation && !estimation.success)
      return (
        <Text fontSize={17} type={TEXT_TYPES.DANGER} style={textStyles.bold}>
          {t('The current transaction batch cannot be sent because it will fail: {{msg}}', {
            msg: mapTxnErrMsg(estimation.message)
          })}
        </Text>
      )

    if (!estimation.feeInNative) return null

    if (estimation && !estimation.feeInUSD && estimation.gasLimit < 40000) {
      return (
        <Text>
          {t(
            "WARNING: Fee estimation unavailable when you're doing your first account transaction and you are not connected to a relayer. You will pay the fee from {{address}}, make sure you have {{symbol}} there.",
            { address: signer.address, symbol: network.nativeAssetSymbol }
          )}
        </Text>
      )
    }
    if (estimation && estimation.feeInUSD && !estimation.remainingFeeTokenBalances) {
      return (
        <Text fontSize={17} type={TEXT_TYPES.DANGER} style={textStyles.bold}>
          {t(
            'Internal error: fee balances not available. This should never happen, please report this on help.ambire.com'
          )}
        </Text>
      )
    }

    const { nativeAssetSymbol } = network
    const tokens = estimation.remainingFeeTokenBalances || [
      { symbol: nativeAssetSymbol, decimals: 18 }
    ]

    const assetsItems = tokens.map((token: any) => ({
      label: token.symbol,
      value: token.symbol,
      disabled: !isTokenEligible(token, feeSpeed, estimation)
    }))

    const feeCurrencySelect = estimation.feeInUSD ? (
      <>
        <Text style={spacings.pbMi}>Fee currency</Text>
        <Select value={currency} setValue={setCurrency} items={assetsItems} />
      </>
    ) : null

    const areSelectorsDisabled = disabled
    const { isStable } = estimation.selectedFeeToken
    const { multiplier } = getFeePaymentConsequences(estimation.selectedFeeToken, estimation)

    const feeAmountSelectors = SPEEDS.map((speed) => (
      <View style={flexboxStyles.flex1} key={speed}>
        <TouchableOpacity
          key={speed}
          onPress={() => !areSelectorsDisabled && setFeeSpeed(speed)}
          style={[styles.feeSelector, feeSpeed === speed && styles.selected]}
          disabled={areSelectorsDisabled}
        >
          <Text
            numberOfLines={1}
            fontSize={13}
            style={[spacings.mbMi, textStyles.uppercase, textStyles.bold]}
            color={colors.invertedTextColor}
          >
            {speed}
          </Text>
          <Text numberOfLines={2} fontSize={15} color={colors.invertedTextColor}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isStable
              ? `$${estimation.feeInUSD[speed] * multiplier}`
              : nativeAssetSymbol === 'ETH'
              ? `Ξ ${estimation.feeInNative[speed] * multiplier}`
              : `${estimation.feeInNative[speed] * multiplier} ${nativeAssetSymbol}`}
          </Text>
        </TouchableOpacity>
      </View>
    ))

    return (
      <>
        {insufficientFee ? (
          <Text fontSize={17} type={TEXT_TYPES.DANGER} style={textStyles.bold}>
            {t('Insufficient balance for the fee. Accepted tokens: ')}
            {(estimation.remainingFeeTokenBalances || []).map((x: any) => x.symbol).join(', ')}
          </Text>
        ) : (
          feeCurrencySelect
        )}
        <View style={styles.selectorsContainer}>{feeAmountSelectors}</View>
        {
          // Visualize the fee once again with a USD estimation if in native currency
          !isStable && (
            <>
              <Text numberOfLines={2}>
                <Text>{t('Fee: ')}</Text>
                <Text>{`${
                  estimation.feeInNative[feeSpeed] * multiplier
                } ${nativeAssetSymbol}`}</Text>
              </Text>
              <Text>
                {`(~ $${(
                  estimation.feeInNative[feeSpeed] *
                  multiplier *
                  estimation.nativeAssetPriceInUSD
                ).toFixed(2)})`}
              </Text>
            </>
          )
        }
        {!estimation.feeInUSD ? (
          <Text>
            {t(
              'WARNING: Paying fees in tokens other than {{symbol}} is unavailable because you are not connected to a relayer. You will pay the fee from {{address}}.',
              { symbol: nativeAssetSymbol, address: signer.address }
            )}
          </Text>
        ) : null}
      </>
    )
  }

  return (
    <View style={styles.panelWrapper}>
      <Panel>
        <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
          <FontAwesome5
            style={spacings.mrTy}
            name="hand-holding-usd"
            size={20}
            color={colors.primaryAccentColor}
          />
          <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
            {t('Fee')}
          </Title>
        </View>

        {renderFeeSelector()}
      </Panel>
    </View>
  )
}

export default FeeSelector
