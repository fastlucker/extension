import { formatUnits } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import {
  getFeeSpeedIdentifier,
  getTokenUsdAmount
} from '@ambire-common/controllers/signAccountOp/helper'
import {
  FeeSpeed,
  SignAccountOpController,
  SigningStatus
} from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useBackgroundService from '@web/hooks/useBackgroundService'
import PayOption from '@web/modules/sign-account-op/components/Estimation/components/PayOption'
import Fee from '@web/modules/sign-account-op/components/Fee'

import SectionHeading from '../SectionHeading'
import AmountInfo from './components/AmountInfo'
import EstimationSkeleton from './components/EstimationSkeleton'
import Warnings from './components/Warnings'
import getStyles from './styles'

type Props = {
  signAccountOpState: SignAccountOpController | null
  disabled: boolean
  hasEstimation: boolean
  slowRequest: boolean
  isViewOnly: boolean
}

const EstimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()

  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.estimationContainer}>
      <SectionHeading>{t('Estimation')}</SectionHeading>
      <ScrollableWrapper style={styles.estimationScrollView}>{children}</ScrollableWrapper>
    </View>
  )
}

const Estimation = ({
  signAccountOpState,
  disabled,
  hasEstimation,
  slowRequest,
  isViewOnly
}: Props) => {
  const estimationFailed = signAccountOpState?.status?.type === SigningStatus.EstimationError
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { minWidthSize } = useWindowSize()

  const payOptions = useMemo(() => {
    if (!signAccountOpState?.availableFeeOptions.length || !hasEstimation || estimationFailed)
      return [
        {
          value: 'no-option',
          label: 'Nothing available at the moment to cover the fee',
          paidBy: 'no-option',
          token: null,
          speedCoverage: []
        }
      ]
    return signAccountOpState.availableFeeOptions
      .sort((a: FeePaymentOption, b: FeePaymentOption) => {
        const aId = getFeeSpeedIdentifier(
          a,
          signAccountOpState.accountOp.accountAddr,
          signAccountOpState.rbfAccountOps[a.paidBy]
        )
        const aSlow = signAccountOpState.feeSpeeds[aId].find((speed) => speed.type === 'slow')
        if (!aSlow) return -1
        const aCanCoverFee = a.availableAmount >= aSlow.amount

        const bId = getFeeSpeedIdentifier(
          b,
          signAccountOpState.accountOp.accountAddr,
          signAccountOpState.rbfAccountOps[b.paidBy]
        )
        const bSlow = signAccountOpState.feeSpeeds[bId].find((speed) => speed.type === 'slow')
        if (!bSlow) return 1
        const bCanCoverFee = b.availableAmount >= bSlow.amount

        if (aCanCoverFee && !bCanCoverFee) return -1
        if (!aCanCoverFee && bCanCoverFee) return 1
        if (a.token.flags.onGasTank && !b.token.flags.onGasTank) return -1
        if (!a.token.flags.onGasTank && b.token.flags.onGasTank) return 1
        return 0
      })
      .map((feeOption) => {
        const gasTankKey = feeOption.token.flags.onGasTank ? 'gasTank' : ''

        const id = getFeeSpeedIdentifier(
          feeOption,
          signAccountOpState.accountOp.accountAddr,
          signAccountOpState.rbfAccountOps[feeOption.paidBy]
        )
        const speedCoverage: FeeSpeed[] = []
        signAccountOpState.feeSpeeds[id].forEach((speed) => {
          if (feeOption.availableAmount >= speed.amount) speedCoverage.push(speed.type)
        })

        const isDisabled = !speedCoverage.includes(FeeSpeed.Slow)
        const disabledReason = isDisabled ? 'Insufficient amount' : undefined

        return {
          value:
            feeOption.paidBy +
            feeOption.token.address +
            feeOption.token.symbol.toLowerCase() +
            gasTankKey,
          label: (
            <PayOption
              feeOption={feeOption}
              disabled={isDisabled}
              disabledReason={disabledReason}
            />
          ),
          paidBy: feeOption.paidBy,
          token: feeOption.token,
          isDisabled,
          speedCoverage
        }
      })
  }, [
    signAccountOpState?.availableFeeOptions,
    signAccountOpState?.accountOp.accountAddr,
    signAccountOpState?.feeSpeeds,
    hasEstimation,
    estimationFailed,
    signAccountOpState?.rbfAccountOps
  ])

  const [payValue, setPayValue] = useState(payOptions[0])
  const [initialSetupDone, setInitialSetupDone] = useState(false)

  const setFeeOption = useCallback(
    (localPayValue: any) => {
      if (!signAccountOpState?.selectedFeeSpeed) return
      setPayValue(localPayValue)

      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          feeToken: localPayValue.token,
          paidBy: localPayValue.paidBy,
          speed: localPayValue.speedCoverage.includes(signAccountOpState.selectedFeeSpeed)
            ? signAccountOpState.selectedFeeSpeed
            : FeeSpeed.Slow
        }
      })
    },
    [dispatch, signAccountOpState?.selectedFeeSpeed]
  )

  useEffect(() => {
    if (!initialSetupDone && payOptions.length > 0) {
      setPayValue(payOptions[0])
    }
  }, [initialSetupDone, payOptions])

  useEffect(() => {
    if (!initialSetupDone && payValue && payValue.token && hasEstimation && !estimationFailed) {
      setInitialSetupDone(true)
      setFeeOption(payValue)
    }
  }, [initialSetupDone, payValue, setFeeOption, hasEstimation, estimationFailed])

  const feeSpeeds = useMemo(() => {
    if (!signAccountOpState?.selectedOption) return []

    const identifier = getFeeSpeedIdentifier(
      signAccountOpState.selectedOption,
      signAccountOpState.accountOp.accountAddr,
      signAccountOpState.rbfAccountOps[signAccountOpState.selectedOption.paidBy]
    )
    return signAccountOpState.feeSpeeds[identifier].map((speed) => ({
      ...speed,
      disabled: !!(
        signAccountOpState.selectedOption &&
        signAccountOpState.selectedOption.availableAmount < speed.amount
      )
    }))
  }, [
    signAccountOpState?.feeSpeeds,
    signAccountOpState?.selectedOption,
    signAccountOpState?.accountOp.accountAddr,
    signAccountOpState?.rbfAccountOps
  ])

  const selectedFee = useMemo(
    () => feeSpeeds.find((speed) => speed.type === signAccountOpState?.selectedFeeSpeed),
    [signAccountOpState?.selectedFeeSpeed, feeSpeeds]
  )

  const onFeeSelect = useCallback(
    (speed: FeeSpeed) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          speed
        }
      })
    },
    [dispatch]
  )

  if ((!hasEstimation && !estimationFailed) || !signAccountOpState) {
    return (
      <EstimationWrapper>
        <EstimationSkeleton />
        <Warnings
          hasEstimation={hasEstimation}
          estimationFailed={estimationFailed}
          slowRequest={slowRequest}
          isViewOnly={isViewOnly}
          rbfDetected={false}
          bundlerFailure={false}
        />
      </EstimationWrapper>
    )
  }

  return (
    <EstimationWrapper>
      {!!hasEstimation && !estimationFailed && (
        <>
          {isSmartAccount(signAccountOpState.account) && (
            <Select
              setValue={setFeeOption}
              label={t('Pay fee with')}
              options={payOptions}
              containerStyle={spacings.mb}
              value={payValue || {}}
              disabled={disabled}
              defaultValue={payValue}
            />
          )}
          {feeSpeeds.length > 0 && (
            <View style={[spacings.mbMd]}>
              <Text fontSize={16} color={theme.secondaryText} style={spacings.mbTy}>
                {t('Transaction speed')}
              </Text>
              <View
                style={[
                  minWidthSize('xxl') && flexbox.wrap,
                  flexbox.flex1,
                  flexbox.directionRow,
                  disabled && { opacity: 0.6 },
                  minWidthSize('xxl') && { margin: -SPACING_MI }
                ]}
              >
                {feeSpeeds.map((fee, i) => (
                  <Fee
                    disabled={disabled || fee.disabled}
                    isLastItem={i === feeSpeeds.length - 1}
                    key={fee.amount + fee.type}
                    label={`${t(fee.type.charAt(0).toUpperCase() + fee.type.slice(1))}:`}
                    type={fee.type}
                    amount={formatDecimals(parseFloat(fee.amountFormatted))}
                    onPress={onFeeSelect}
                    isSelected={signAccountOpState.selectedFeeSpeed === fee.type}
                  />
                ))}
                {/* TODO: <CustomFee onPress={() => {}} /> */}
              </View>
            </View>
          )}
          {!!selectedFee && !!payValue && (
            <AmountInfo
              label="Fee"
              amountFormatted={selectedFee.amountFormatted}
              amountUsd={selectedFee.amountUsd}
              symbol={payValue.token?.symbol}
            />
          )}
          {/* // TODO: - once we clear out the gas tank functionality, here we need to render what gas it saves */}
          {/* <View style={styles.gasTankContainer}> */}
          {/*  <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text> */}
          {/*  <Text style={styles.gasTankText}>$ 2.6065</Text> */}
          {/* </View> */}
          {signAccountOpState.selectedOption && payValue && payValue.token && (
            <AmountInfo
              label="Available"
              amountFormatted={formatUnits(
                signAccountOpState.selectedOption.availableAmount,
                Number(payValue.token.decimals)
              )}
              amountUsd={getTokenUsdAmount(
                payValue.token,
                signAccountOpState.selectedOption.availableAmount
              )}
              symbol={payValue.token.symbol}
            />
          )}
        </>
      )}
      <Warnings
        hasEstimation={hasEstimation}
        estimationFailed={estimationFailed}
        slowRequest={slowRequest}
        isViewOnly={isViewOnly}
        rbfDetected={!!signAccountOpState.rbfAccountOps[payValue.paidBy]}
        bundlerFailure={
          !!signAccountOpState.estimation?.nonFatalErrors?.find(
            (err) => err.cause === '4337_ESTIMATION'
          )
        }
      />
    </EstimationWrapper>
  )
}

export default React.memo(Estimation)
