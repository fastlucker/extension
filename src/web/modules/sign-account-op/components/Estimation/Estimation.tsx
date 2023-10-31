/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import CustomFee from '@web/modules/sign-account-op/components/CustomFee'
import PayOption from '@web/modules/sign-account-op/components/Estimation/components/PayOption'
import Fee from '@web/modules/sign-account-op/components/Fee'

import styles from './styles'

type Props = {
  networkId: NetworkDescriptor['id']
}

const Estimation = ({ networkId }: Props) => {
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
    portfolioState.accountPortfolio?.tokens,
    networkId
  ])

  const defaultPayOption = useMemo(
    () =>
      payOptions.find(
        ({ value }: any) =>
          value === signAccountOpState.paidBy! + signAccountOpState.selectedTokenAddr!
      ),
    [payOptions, signAccountOpState.paidBy, signAccountOpState.selectedTokenAddr]
  )

  const [payValue, setPayValue] = useState(defaultPayOption)

  useEffect(() => {
    if (payValue && payValue.token) {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          feeTokenAddr: payValue.token.address,
          paidBy: payValue.paidBy
        }
      })
    }
  }, [dispatch, payValue])

  // Signing is ready therefore broadcast transaction
  useEffect(() => {
    if (
      signAccountOpState.accountOp?.signature &&
      signAccountOpState.status?.type === SigningStatus.Done
    ) {
      dispatch({
        type: 'MAIN_CONTROLLER_BROADCAST_SIGNED_ACCOUNT_OP',
        params: { accountOp: signAccountOpState.accountOp }
      })
    }
  }, [signAccountOpState, dispatch])

  const selectedFee = useMemo(
    () =>
      signAccountOpState.feeSpeeds.find(
        (speed) => speed.type === signAccountOpState.selectedFeeSpeed
      ),
    [signAccountOpState.selectedFeeSpeed, signAccountOpState.feeSpeeds]
  )

  const onFeeSelect = useCallback(
    (speed: string) => {
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
        style={styles.tokenSelect}
        labelStyle={styles.tokenSelectLabel}
        value={payValue || {}}
        defaultValue={payValue}
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
        {!!selectedFee && !!payValue && (
          <View style={styles.feeContainer}>
            <Text style={styles.fee}>
              {t('Fee')}: {selectedFee.amountFormatted} {payValue.token?.symbol}
            </Text>
            <Text style={styles.feeUsd}>~ ${Number(selectedFee.amountUsd).toFixed(4)}</Text>
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

export default Estimation
