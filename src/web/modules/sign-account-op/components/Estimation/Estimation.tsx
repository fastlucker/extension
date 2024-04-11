/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getFeeSpeedIdentifier } from '@ambire-common/controllers/signAccountOp/helper'
import {
  FeeSpeed,
  SignAccountOpController
} from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
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

import getStyles from './styles'

type Props = {
  signAccountOpState: SignAccountOpController
  disabled: boolean
}

const Estimation = ({ signAccountOpState, disabled }: Props) => {
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme(getStyles)
  const { minWidthSize } = useWindowSize()

  const payOptions = useMemo(() => {
    if (!signAccountOpState.availableFeeOptions.length)
      return [
        {
          value: 'no-option',
          label: 'Nothing available at the moment to cover the fee',
          paidBy: 'no-option',
          token: null
        }
      ]
    return signAccountOpState.availableFeeOptions
      .sort((a: FeePaymentOption, b: FeePaymentOption) => {
        const aId = getFeeSpeedIdentifier(a, signAccountOpState.accountOp.accountAddr)
        const aSlow = signAccountOpState.feeSpeeds[aId].find((speed) => speed.type === 'slow')
        if (!aSlow) return -1
        const aCanCoverFee = a.availableAmount > aSlow.amount

        const bId = getFeeSpeedIdentifier(b, signAccountOpState.accountOp.accountAddr)
        const bSlow = signAccountOpState.feeSpeeds[bId].find((speed) => speed.type === 'slow')
        if (!bSlow) return 1
        const bCanCoverFee = b.availableAmount > bSlow.amount

        if (aCanCoverFee && !bCanCoverFee) return -1
        if (!aCanCoverFee && bCanCoverFee) return 1
        if (a.token.flags.onGasTank && !b.token.flags.onGasTank) return -1
        if (!a.token.flags.onGasTank && b.token.flags.onGasTank) return 1
        return 0
      })
      .map((feeOption) => {
        const gasTankKey = feeOption.token.flags.onGasTank === true ? 'gasTank' : ''
        return {
          value: feeOption.paidBy + feeOption.token.address + gasTankKey,
          label: <PayOption feeOption={feeOption} />,
          paidBy: feeOption.paidBy,
          token: feeOption.token
        }
      })
  }, [
    signAccountOpState.availableFeeOptions,
    signAccountOpState.accountOp.accountAddr,
    signAccountOpState.feeSpeeds
  ])

  const defaultPayOption = useMemo(() => {
    if (!payOptions) return undefined

    return payOptions[0]
  }, [payOptions])

  const [payValue, setPayValue] = useState(defaultPayOption)

  useEffect(() => {
    if (payValue && payValue.token) {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          feeToken: payValue.token,
          paidBy: payValue.paidBy
        }
      })
    }
  }, [dispatch, payValue])

  const feeSpeeds = useMemo(() => {
    if (!signAccountOpState.selectedOption) return []

    const identifier = getFeeSpeedIdentifier(
      signAccountOpState.selectedOption,
      signAccountOpState.accountOp.accountAddr
    )
    return signAccountOpState.feeSpeeds[identifier]
  }, [
    signAccountOpState.feeSpeeds,
    signAccountOpState.selectedOption,
    signAccountOpState.accountOp.accountAddr
  ])

  const selectedFee = useMemo(
    () => feeSpeeds.find((speed) => speed.type === signAccountOpState.selectedFeeSpeed),
    [signAccountOpState.selectedFeeSpeed, feeSpeeds]
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

  return (
    <>
      <Select
        setValue={setPayValue}
        label={t('Pay fee with')}
        options={payOptions}
        style={spacings.mb}
        value={payValue || {}}
        disabled={disabled}
        defaultValue={payValue}
      />
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
                disabled={disabled}
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
      <View>
        {!!selectedFee && !!payValue && (
          <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <Text fontSize={16} weight="medium" style={spacings.mrTy}>
                {t('Fee')}:
              </Text>
              <Text selectable fontSize={16} weight="medium">
                {formatDecimals(parseFloat(selectedFee.amountFormatted))} {payValue.token?.symbol}
              </Text>
              {selectedFee.amountUsd ? (
                <Text selectable weight="medium" fontSize={16} appearance="primary">
                  {' '}
                  (~ ${formatDecimals(Number(selectedFee.amountUsd))})
                </Text>
              ) : null}
            </View>
          </View>
        )}
        {/* // TODO: - once we clear out the gas tank functionality, here we need to render what gas it saves */}
        {/* <View style={styles.gasTankContainer}> */}
        {/*  <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text> */}
        {/*  <Text style={styles.gasTankText}>$ 2.6065</Text> */}
        {/* </View> */}
      </View>
    </>
  )
}

export default React.memo(Estimation)
