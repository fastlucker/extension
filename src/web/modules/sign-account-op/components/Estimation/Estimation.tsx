/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import CustomFee from '@web/modules/sign-account-op/components/CustomFee'
import PayOption from '@web/modules/sign-account-op/components/Estimation/components/PayOption'
import Fee from '@web/modules/sign-account-op/components/Fee'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'

import styles from './styles'

const Estimation = ({ networkId }: any) => {
  const signAccountOpState = useSignAccountOpControllerState()
  const mainState = useMainControllerState()
  const portfolioState = usePortfolioControllerState()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  const payOptions = useMemo(() => {
    return signAccountOpState.availableFeeOptions.map((feeOption) => {
      const account = mainState.accounts.find((acc) => acc.addr === feeOption.paidBy)
      const token = portfolioState.accountPortfolio?.tokens.find(
        (t) => t.address === feeOption.address && t.networkId === networkId
      )

      return {
        value: feeOption.paidBy + feeOption.address,
        label: <PayOption account={account} token={token} />,
        paidBy: feeOption.paidBy,
        token
      }
    })
  }, [
    signAccountOpState.availableFeeOptions,
    mainState.accounts,
    portfolioState.accountPortfolio,
    networkId
  ])

  const { control, watch } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      pay: payOptions.find(
        ({ value }: any) =>
          value === signAccountOpState.paidBy! + signAccountOpState.selectedTokenAddr!
      )
    }
  })

  const pay = watch('pay')

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
      params: {
        feeTokenAddr: pay.token.address,
        paidBy: pay.paidBy
      }
    })
  }, [dispatch, pay])

  const selectedFee = useMemo(
    () =>
      signAccountOpState.feeSpeeds.find(
        (speed) => speed.type === signAccountOpState.selectedFeeSpeed
      ) || {},
    [signAccountOpState.selectedFeeSpeed, signAccountOpState.feeSpeeds]
  )

  const onFeeSelect = useCallback(
    (speed) => {
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
      <Controller
        name="pay"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            setValue={onChange}
            label={t('Pay fee with')}
            options={payOptions}
            style={styles.tokenSelect}
            labelStyle={styles.tokenSelectLabel}
            value={value}
            defaultValue={value}
          />
        )}
      />
      <View style={styles.transactionSpeedContainer}>
        <Text style={styles.transactionSpeedLabel}>Transaction speed</Text>
        <View style={styles.feesContainer}>
          {signAccountOpState.feeSpeeds.map((fee) => (
            <Fee
              key={fee.amount + fee.type}
              label={`${t(fee.type.charAt(0).toUpperCase() + fee.type.slice(1))}:`}
              type={fee.type}
              amount={fee.amountFormatted}
              onPress={onFeeSelect}
              isSelected={signAccountOpState.selectedFeeSpeed === fee.type}
              style={styles.mr10}
            />
          ))}
          <CustomFee onPress={() => {}} />
        </View>
      </View>
      <View>
        <View style={styles.feeContainer}>
          <Text style={styles.fee}>
            {t('Fee')}: {selectedFee.amountFormatted} {pay.token.symbol}
          </Text>
          <Text style={styles.feeUsd}>~ ${Number(selectedFee.amountUsd).toFixed(4)}</Text>
        </View>
        {/* // TODO - once we clear out the gas tank functionality, here we need to render what gas it saves */}
        {/* <View style={styles.gasTankContainer}> */}
        {/*  <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text> */}
        {/*  <Text style={styles.gasTankText}>$ 2.6065</Text> */}
        {/* </View> */}
      </View>
      {signAccountOpState!.status?.type === SigningStatus.Done && (
        <View style={{ marginTop: 20 }}>
          <Text>Signature: {signAccountOpState!.accountOp!.signature}</Text>
        </View>
      )}
    </>
  )
}

export default Estimation
