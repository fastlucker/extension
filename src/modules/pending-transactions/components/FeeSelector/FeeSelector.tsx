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
import { formatFloatTokenAmount } from '@modules/common/services/formatters'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import {
  getDiscountApplied,
  getFeesData,
  isTokenEligible,
  mapTxnErrMsg
} from '@modules/pending-transactions/services/helpers'

import CustomFee from './CustomFee'
import styles from './styles'

const SPEEDS = ['slow', 'medium', 'fast', 'ape']
const OVERPRICED_MULTIPLIER = 1.2

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
  const [editCustomFee, setEditCustomFee] = useState(false)

  // Initially sets a value in the Select
  useEffect(() => {
    if (!currency && estimation?.selectedFeeToken?.symbol) {
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
        <Text style={spacings.pbMi}>{t('Fee Currency')}</Text>
        <Select value={currency} setValue={setCurrency} items={assetsItems} />
      </>
    ) : null

    const { discount = 0, symbol, nativeRate, decimals } = estimation.selectedFeeToken

    const setCustomFee = (value: any) =>
      setEstimation((prevEstimation: any) => ({
        ...prevEstimation,
        customFee: value
      }))

    const selectFeeSpeed = (speed: any) => {
      setFeeSpeed(speed)
      setCustomFee(null)
      setEditCustomFee(false)
    }

    const checkIsSelectorDisabled = (speed: any) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const insufficientFee = !isTokenEligible(estimation.selectedFeeToken, speed, estimation)
      return disabled || insufficientFee
    }

    const feeAmountSelectors = SPEEDS.map((speed) => {
      const isETH = symbol === 'ETH' && nativeAssetSymbol === 'ETH'

      const {
        feeInFeeToken,
        feeInUSD
        // NOTE: get the estimation res data w/o custom fee for the speeds
      } = getFeesData({ ...estimation.selectedFeeToken }, { ...estimation, customFee: null }, speed)

      const discountInFeeToken = getDiscountApplied(feeInFeeToken, discount)
      const discountInFeeInUSD = getDiscountApplied(feeInUSD, discount)

      const baseFeeInFeeToken = feeInFeeToken + discountInFeeToken
      const baseFeeInFeeUSD = feeInUSD ? feeInUSD + discountInFeeInUSD : null

      const showInUSD = nativeRate !== null && baseFeeInFeeUSD

      return (
        <View style={flexboxStyles.flex1} key={speed}>
          <TouchableOpacity
            key={speed}
            onPress={() => {
              !checkIsSelectorDisabled(speed) && selectFeeSpeed(speed)
            }}
            style={[
              styles.feeSelector,
              !estimation.customFee && feeSpeed === speed && styles.selected
            ]}
            disabled={checkIsSelectorDisabled(speed)}
          >
            <Text
              numberOfLines={1}
              fontSize={13}
              style={[spacings.mbMi, textStyles.uppercase, textStyles.bold]}
              color={colors.textColor}
            >
              {speed}
            </Text>
            <Text numberOfLines={2} fontSize={15} color={colors.secondaryTextColor}>
              {(isETH ? 'Ξ ' : '') +
                (showInUSD
                  ? `$${formatFloatTokenAmount(baseFeeInFeeUSD, true, 4)}`
                  : formatFloatTokenAmount(baseFeeInFeeToken, true, decimals)) +
                (!isETH && !showInUSD ? ` ${estimation.selectedFeeToken.symbol}` : '')}
            </Text>
            {!isETH && !showInUSD && (
              <Text fontSize={12} color={colors.secondaryTextColor}>
                {estimation.selectedFeeToken.symbol}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )
    })

    const { feeInFeeToken, feeInUSD } = getFeesData(
      estimation.selectedFeeToken,
      estimation,
      feeSpeed
    )

    const { feeInFeeToken: minFee, feeInUSD: minFeeUSD } = getFeesData(
      { ...estimation.selectedFeeToken },
      { ...estimation, customFee: null },
      'slow'
    )

    const { feeInFeeToken: maxFee, feeInUSD: maxFeeUSD } = getFeesData(
      { ...estimation.selectedFeeToken },
      { ...estimation, customFee: null },
      'ape'
    )

    const discountMin = getDiscountApplied(minFee, discount)
    const discountMax = getDiscountApplied(maxFee, discount)

    const discountInFeeToken = getDiscountApplied(feeInFeeToken, discount)
    const discountInUSD = getDiscountApplied(feeInUSD, discount)
    const discountBaseMinInUSD = getDiscountApplied(minFeeUSD, discount)
    const discountBaseMaxInUSD = getDiscountApplied(maxFeeUSD, discount)

    // Fees with no discounts applied
    const baseFeeInFeeToken = feeInFeeToken + discountInFeeToken
    const baseFeeInUSD = feeInUSD + discountInUSD
    const baseMinFee = minFee + discountMin
    const baseMaxFee = (maxFee + discountMax) * OVERPRICED_MULTIPLIER
    const baseMinFeeUSD = minFeeUSD + discountBaseMinInUSD
    const baseMaxFeeUSD = (maxFeeUSD + discountBaseMaxInUSD) * OVERPRICED_MULTIPLIER

    const isUnderpriced =
      !!estimation.customFee &&
      !Number.isNaN(parseFloat(estimation.customFee)) &&
      baseFeeInFeeToken < baseMinFee

    const isOverpriced =
      !!estimation.customFee &&
      !Number.isNaN(parseFloat(estimation.customFee)) &&
      baseFeeInFeeToken > baseMaxFee

    return (
      <>
        {insufficientFee ? (
          <Text fontSize={17} type={TEXT_TYPES.DANGER} style={[textStyles.bold, spacings.mbTy]}>
            {t('Insufficient balance for the fee. Accepted tokens: ')}
            {(estimation.remainingFeeTokenBalances || []).map((x: any) => x.symbol).join(', ')}
          </Text>
        ) : (
          feeCurrencySelect
        )}

        <Text style={spacings.pbMi}>{t('Transaction Speed')}</Text>
        <View style={styles.selectorsContainer}>{feeAmountSelectors}</View>

        <CustomFee
          isEditEnabled={editCustomFee}
          setEnableEdit={() => setEditCustomFee(true)}
          setCustomFee={setCustomFee}
          value={estimation.customFee}
          symbol={symbol}
        />

        {isUnderpriced && (
          <View style={[{ marginTop: -15 }, spacings.mbSm]}>
            <Text fontSize={14} color={colors.warningColor} style={spacings.mbMi}>
              {t(
                'Custom Fee too low. You can try to "sign and send" the transaction but most probably it will fail.'
              )}
            </Text>
            <Text fontSize={14} color={colors.warningColor}>
              {t('Min estimated fee: ')}
              <Text underline fontSize={15} onPress={() => setCustomFee(baseMaxFee.toString())}>
                {baseMinFee} {symbol}
              </Text>
              {!Number.isNaN(baseMinFeeUSD) && (
                <Text fontSize={14} color={colors.warningColor}>
                  &nbsp; (~${formatFloatTokenAmount(baseMinFeeUSD, true, 4)}){' '}
                </Text>
              )}
            </Text>
          </View>
        )}

        {isOverpriced && (
          <View style={[{ marginTop: -15 }, spacings.mbSm]}>
            <Text fontSize={14} color={colors.warningColor} style={spacings.mbMi}>
              {t(
                'Custom Fee is higher than the APE speed. You will pay more than probably needed. Make sure you know what are you doing!'
              )}
            </Text>
            <Text fontSize={14} color={colors.warningColor}>
              {t('Recommended max fee: ')}
              <Text underline fontSize={15} onPress={() => setCustomFee(baseMaxFee.toString())}>
                {baseMaxFee} {symbol}
              </Text>
              <Text />
              {!Number.isNaN(baseMaxFeeUSD) && (
                <Text fontSize={14} color={colors.warningColor}>
                  &nbsp; (~${formatFloatTokenAmount(baseMaxFeeUSD, true, 4)}){' '}
                </Text>
              )}
            </Text>
          </View>
        )}

        <View style={styles.unstableFeeContainer}>
          <Text style={flexboxStyles.flex1}>{t('Fee: ')}</Text>
          <View style={flexboxStyles.alignEnd}>
            {!Number.isNaN(baseFeeInUSD) && (
              <Text style={spacings.mbMi}>
                {`~ $${formatFloatTokenAmount(baseFeeInUSD, true, 4)}`}
              </Text>
            )}
            {!Number.isNaN(baseFeeInFeeToken) && (
              <Text numberOfLines={2} fontSize={12}>
                {`${formatFloatTokenAmount(baseFeeInFeeToken, true, decimals)} ${
                  estimation.selectedFeeToken.symbol
                }`}
              </Text>
            )}
          </View>
        </View>

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
  )
}

export default FeeSelector
