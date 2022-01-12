import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import P from '@modules/common/components/P'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import {
  getErrHint,
  getFeePaymentConsequences,
  isTokenEligible,
  mapTxnErrMsg
} from '@modules/pending-transactions/services/helpers'

const SPEEDS = ['slow', 'medium', 'fast', 'ape']

export function FailingTxn({ message, tooltip = '' }: any) {
  return (
    <div className="failingTxn">
      {/* <AiOutlineWarning /> */}
      <Text>{message}</Text>
      {/* <FiHelpCircle title={tooltip} /> */}
    </div>
  )
}

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
        <FailingTxn
          message={
            <>
              The current transaction batch cannot be sent because it will fail:{' '}
              {mapTxnErrMsg(estimation.message)}
            </>
          }
          tooltip={getErrHint(estimation.message)}
        />
      )

    if (!estimation.feeInNative) return null

    if (estimation && !estimation.feeInUSD && estimation.gasLimit < 40000) {
      return (
        <Text>
          {`WARNING: Fee estimation unavailable when you're doing your first account
          transaction and you are not connected to a relayer. You will pay the fee from${' '}
          ${signer.address}, make sure you have ${network.nativeAssetSymbol} there.`}
        </Text>
      )
    }
    if (estimation && estimation.feeInUSD && !estimation.remainingFeeTokenBalances) {
      return (
        <Text>
          Internal error: fee balances not available. This should never happen, please report this
          on help.ambire.com
        </Text>
      )
    }

    const { nativeAssetSymbol } = network
    const tokens = estimation.remainingFeeTokenBalances || [
      { symbol: nativeAssetSymbol, decimals: 18 }
    ]

    const onFeeCurrencyChange = (e: any) => {
      const token = tokens.find(({ symbol }: any) => symbol === e.target.value)
      setEstimation({ ...estimation, selectedFeeToken: token })
    }

    const feeCurrencySelect = estimation.feeInUSD ? (
      <>
        <P>Fee currency</P>
        {/* <select
          disabled={disabled}
          value={estimation.selectedFeeToken.symbol}
          onChange={onFeeCurrencyChange}
        >
          {tokens.map((token: any) => (
            <option disabled={!isTokenEligible(token, feeSpeed, estimation)} key={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select> */}
      </>
    ) : null

    const areSelectorsDisabled = disabled || insufficientFee
    const { isStable } = estimation.selectedFeeToken
    const { multiplier } = getFeePaymentConsequences(estimation.selectedFeeToken, estimation)

    const feeAmountSelectors = SPEEDS.map((speed) => (
      <TouchableOpacity key={speed} onPress={() => !areSelectorsDisabled && setFeeSpeed(speed)}>
        <Text>{speed}</Text>
        <Text>
          {/* eslint-disable-next-line no-nested-ternary */}
          {isStable
            ? `$${estimation.feeInUSD[speed] * multiplier}`
            : nativeAssetSymbol === 'ETH'
            ? `Ξ ${estimation.feeInNative[speed] * multiplier}`
            : `${estimation.feeInNative[speed] * multiplier} ${nativeAssetSymbol}`}
        </Text>
      </TouchableOpacity>
    ))

    return (
      <>
        {insufficientFee ? (
          <Text>
            Insufficient balance for the fee. Accepted tokens:{' '}
            {(estimation.remainingFeeTokenBalances || []).map((x: any) => x.symbol).join(', ')}
          </Text>
        ) : (
          feeCurrencySelect
        )}
        <View>{feeAmountSelectors}</View>
        {
          // Visualize the fee once again with a USD estimation if in native currency
          !isStable && (
            <Text>
              Fee: {`${estimation.feeInNative[feeSpeed] * multiplier} ${nativeAssetSymbol}`}
              &nbsp;(~ $
              {(
                estimation.feeInNative[feeSpeed] *
                multiplier *
                estimation.nativeAssetPriceInUSD
              ).toFixed(2)}
              )
            </Text>
          )
        }
        {!estimation.feeInUSD ? (
          <Text>
            {`WARNING: Paying fees in tokens other than ${nativeAssetSymbol} is unavailable because you
            are not connected to a relayer. You will pay the fee from ${signer.address}.`}
          </Text>
        ) : null}
      </>
    )
  }

  return (
    <Panel>
      <Title>{t('Fee')}</Title>
      {renderFeeSelector()}
    </Panel>
  )
}

export default FeeSelector
