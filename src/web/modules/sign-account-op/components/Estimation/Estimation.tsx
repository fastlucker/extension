import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getFeeSpeedIdentifier } from '@ambire-common/controllers/signAccountOp/helper'
import { FeeSpeed, SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { isSmartAccount as getIsSmartAccount } from '@ambire-common/libs/account/account'
import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import AssetIcon from '@common/assets/svg/AssetIcon'
import FeeIcon from '@common/assets/svg/FeeIcon'
import Alert from '@common/components/Alert'
import { SectionedSelect } from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Fee from '@web/modules/sign-account-op/components/Fee'
import Warnings from '@web/modules/sign-account-op/components/Warnings'

import AmountInfo from './components/AmountInfo'
import EstimationSkeleton from './components/EstimationSkeleton'
import EstimationWrapper from './components/EstimationWrapper'
import { NO_FEE_OPTIONS } from './consts'
import { getDefaultFeeOption, getDummyFeeOptions, mapFeeOptions, sortFeeOptions } from './helpers'
import { FeeOption, Props } from './types'

const Estimation = ({
  signAccountOpState,
  disabled,
  hasEstimation,
  slowRequest,
  slowPaymasterRequest,
  isViewOnly
}: Props) => {
  const estimationFailed = signAccountOpState?.status?.type === SigningStatus.EstimationError
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { minWidthSize } = useWindowSize()
  const { keys } = useKeystoreControllerState()
  const { accountStates, accounts } = useAccountsControllerState()
  const isSmartAccount = getIsSmartAccount(signAccountOpState?.account)

  const payOptionsPaidByUsOrGasTank = useMemo(() => {
    if (!signAccountOpState?.availableFeeOptions.length || !hasEstimation) return []

    // No need to sort and filter if it's not a smart account
    if (!isSmartAccount) {
      return [
        signAccountOpState.availableFeeOptions[0],
        ...getDummyFeeOptions(
          signAccountOpState.accountOp.networkId,
          signAccountOpState.account.addr
        )
      ].map((feeOption) => mapFeeOptions(feeOption, signAccountOpState))
    }

    return signAccountOpState.availableFeeOptions
      .filter((feeOption) => feeOption.paidBy === signAccountOpState.accountOp.accountAddr)
      .sort((a: FeePaymentOption, b: FeePaymentOption) => sortFeeOptions(a, b, signAccountOpState))
      .map((feeOption) => mapFeeOptions(feeOption, signAccountOpState))
  }, [hasEstimation, isSmartAccount, signAccountOpState])

  const payOptionsPaidByEOA = useMemo(() => {
    if (!signAccountOpState?.availableFeeOptions.length || !hasEstimation) return []

    return signAccountOpState.availableFeeOptions
      .filter((feeOption) => feeOption.paidBy !== signAccountOpState.accountOp.accountAddr)
      .sort((a: FeePaymentOption, b: FeePaymentOption) => sortFeeOptions(a, b, signAccountOpState))
      .map((feeOption) => mapFeeOptions(feeOption, signAccountOpState))
  }, [hasEstimation, signAccountOpState])

  const defaultFeeOption = useMemo(
    () => getDefaultFeeOption(payOptionsPaidByUsOrGasTank, payOptionsPaidByEOA),
    [payOptionsPaidByEOA, payOptionsPaidByUsOrGasTank]
  )

  const [payValue, setPayValue] = useState<FeeOption | null>(null)

  // Only Hardware Wallet signatures are needed manually as the keys of
  // hot wallets are stored in the extension
  const areTwoHWSignaturesRequired = useMemo(() => {
    const paidBy = payValue?.paidBy

    if (!paidBy || paidBy === signAccountOpState?.accountOp.accountAddr) return false

    const paidByAccountData = accounts.find((account) => account.addr === paidBy)
    const selectedAccountData = accounts.find(
      (account) => account.addr === signAccountOpState?.accountOp.accountAddr
    )
    if (!paidByAccountData || !selectedAccountData) return false

    const selectedAccountAssociatedKeys = selectedAccountData?.associatedKeys || []
    const paidByAssociatedKeys = paidByAccountData.associatedKeys || []
    const selectedAccountImportedKeys = Array.from(
      new Set(keys.filter(({ addr }) => selectedAccountAssociatedKeys.includes(addr)))
    )
    const paidByImportedKeys = Array.from(
      new Set(keys.filter(({ addr }) => paidByAssociatedKeys.includes(addr)))
    )
    const isSelectedAccountHW = selectedAccountImportedKeys.some(({ type }) => type !== 'internal')
    const isPaidByHW = paidByImportedKeys.some(({ type }) => type !== 'internal')

    return isSelectedAccountHW && isPaidByHW
  }, [accounts, keys, payValue?.paidBy, signAccountOpState?.accountOp.accountAddr])

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

  const isSmartAccountAndNotDeployed = useMemo(() => {
    if (!isSmartAccount || !signAccountOpState?.accountOp?.accountAddr) return false

    const accountState =
      accountStates[signAccountOpState?.accountOp.accountAddr][
        signAccountOpState?.accountOp.networkId
      ]

    return !accountState?.isDeployed
  }, [
    accountStates,
    isSmartAccount,
    signAccountOpState?.accountOp.accountAddr,
    signAccountOpState?.accountOp.networkId
  ])

  useEffect(() => {
    if (!hasEstimation) return

    const isInitialValueSet = !!payValue
    const canPayFeeAfterNotBeingAbleToPayInitially =
      payValue?.value === NO_FEE_OPTIONS.value && defaultFeeOption.value !== NO_FEE_OPTIONS.value
    const feeOptionNoLongerViable = payValue?.disabled !== defaultFeeOption.disabled

    if (!isInitialValueSet || canPayFeeAfterNotBeingAbleToPayInitially || feeOptionNoLongerViable) {
      setFeeOption(defaultFeeOption)
    }
  }, [
    payValue,
    setFeeOption,
    hasEstimation,
    defaultFeeOption.value,
    defaultFeeOption,
    signAccountOpState?.account.addr
  ])

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

  const feeOptionSelectSections = useMemo(() => {
    if (!payOptionsPaidByUsOrGasTank.length && !payOptionsPaidByEOA.length)
      return [
        {
          data: [NO_FEE_OPTIONS],
          key: 'no-options'
        }
      ]

    return [
      {
        title: {
          icon: <FeeIcon color={theme.secondaryText} width={16} height={16} />,
          text: t('With fee tokens from current account')
        },
        data: payOptionsPaidByUsOrGasTank,
        key: 'account-tokens'
      },
      {
        title: {
          icon: <AssetIcon color={theme.secondaryText} width={16} height={16} />,
          text: t('With native assets of my basic accounts')
        },
        data: payOptionsPaidByEOA,
        key: 'eoa-tokens'
      }
    ]
  }, [payOptionsPaidByEOA, payOptionsPaidByUsOrGasTank, t, theme.secondaryText])

  const renderFeeOptionSectionHeader = useCallback(
    ({ section }: any) => {
      if (section.data.length === 0 || !section.title) return null

      return (
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            spacings.phTy,
            spacings.pvTy,
            {
              backgroundColor: theme.primaryBackground
            },
            section?.key === 'eoa-tokens' && {
              borderTopWidth: 1,
              borderTopColor: theme.secondaryBorder
            }
          ]}
        >
          {section.title.icon}
          <Text
            style={minWidthSize('xl') ? spacings.mlMi : spacings.mlTy}
            fontSize={minWidthSize('xl') ? 12 : 14}
            weight="medium"
            appearance="secondaryText"
          >
            {section.title.text}
          </Text>
        </View>
      )
    },
    [minWidthSize, theme.primaryBackground, theme.secondaryBorder]
  )

  if (!signAccountOpState || !hasEstimation || !payValue) {
    return (
      <EstimationWrapper>
        {!estimationFailed && <EstimationSkeleton />}
        {estimationFailed && (
          <Alert
            type="info"
            title={t('The estimation could not be completed because of the transaction problem.')}
          />
        )}
        <Warnings
          hasEstimation={hasEstimation}
          slowRequest={slowRequest}
          slowPaymasterRequest={slowPaymasterRequest}
          isViewOnly={isViewOnly}
          rbfDetected={false}
          bundlerFailure={false}
        />
      </EstimationWrapper>
    )
  }

  return (
    <EstimationWrapper>
      <SectionedSelect
        setValue={setFeeOption}
        testID="fee-option-select"
        label={t('Pay fee with')}
        sections={feeOptionSelectSections}
        renderSectionHeader={renderFeeOptionSectionHeader}
        containerStyle={areTwoHWSignaturesRequired ? spacings.mbTy : spacings.mb}
        value={payValue || NO_FEE_OPTIONS}
        disabled={
          disabled ||
          (!payOptionsPaidByUsOrGasTank.length && !payOptionsPaidByEOA.length) ||
          defaultFeeOption.label === NO_FEE_OPTIONS.label
        }
        defaultValue={payValue ?? undefined}
        withSearch={!!payOptionsPaidByUsOrGasTank.length || !!payOptionsPaidByEOA.length}
        stickySectionHeadersEnabled
      />
      {areTwoHWSignaturesRequired && (
        <Alert
          size="sm"
          text={t(
            "You've opt in to pay the transaction with Basic account, controlled by a Hardware Wallet, the signing process would require 2 signatures - one by the smart account and one by the Basic account, that would broadcast the transaction."
          )}
          style={spacings.mbSm}
        />
      )}
      {feeSpeeds.length > 0 && (
        <View style={[spacings.mbMd]}>
          <Text fontSize={16} color={theme.secondaryText} style={spacings.mbTy}>
            {t('Transaction speed')}
          </Text>
          <View
            style={[
              flexbox.wrap,
              flexbox.flex1,
              flexbox.directionRow,
              disabled && { opacity: 0.6 },
              minWidthSize('xxl') && { margin: -SPACING_MI }
            ]}
          >
            {feeSpeeds.map((fee) => (
              <Fee
                disabled={disabled || fee.disabled}
                key={fee.amount + fee.type}
                label={`${t(fee.type.charAt(0).toUpperCase() + fee.type.slice(1))}:`}
                type={fee.type}
                amountUsd={parseFloat(fee.amountUsd)}
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
          amountFormatted={formatDecimals(parseFloat(selectedFee.amountFormatted))}
          symbol={payValue.token?.symbol}
        />
      )}
      {!!signAccountOpState.gasSavedUSD && (
        <AmountInfo.Wrapper>
          <AmountInfo.Label appearance="primary">{t('Gas Tank saves you')}</AmountInfo.Label>
          <AmountInfo.Text appearance="primary" selectable>
            {formatDecimals(signAccountOpState.gasSavedUSD, 'price')} USD
          </AmountInfo.Text>
        </AmountInfo.Wrapper>
      )}
      {/* // TODO: - once we clear out the gas tank functionality, here we need to render what gas it saves */}
      {/* <View style={styles.gasTankContainer}> */}
      {/*  <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text> */}
      {/*  <Text style={styles.gasTankText}>$ 2.6065</Text> */}
      {/* </View> */}
      <Warnings
        hasEstimation={hasEstimation}
        slowRequest={slowRequest}
        slowPaymasterRequest={slowPaymasterRequest}
        isViewOnly={isViewOnly}
        rbfDetected={payValue?.paidBy ? !!signAccountOpState.rbfAccountOps[payValue.paidBy] : false}
        bundlerFailure={
          !!signAccountOpState.estimation?.nonFatalErrors?.find(
            (err) => err.cause === '4337_ESTIMATION'
          )
        }
      />
      {isSmartAccountAndNotDeployed && !estimationFailed ? (
        <Alert
          type="info"
          title={t('Note')}
          style={spacings.mtTy}
          text={t(
            'Because this is your first Ambire transaction, the fee is 32% higher than usual because we have to deploy your smart wallet. Subsequent transactions will be cheaper.'
          )}
        />
      ) : null}
    </EstimationWrapper>
  )
}

export default React.memo(Estimation)
