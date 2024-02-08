/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { MainController } from '@ambire-common/controllers/main/main'
import {
  FeeSpeed,
  SignAccountOpController
} from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'
import useBackgroundService from '@web/hooks/useBackgroundService'
import PayOption from '@web/modules/sign-account-op/components/Estimation/components/PayOption'
import Fee from '@web/modules/sign-account-op/components/Fee'

import getStyles from './styles'

type Props = {
  mainState: MainController
  accountPortfolio: AccountPortfolio | null
  signAccountOpState: SignAccountOpController
  networkId: NetworkDescriptor['id']
  disabled: boolean
}

const Estimation = ({
  mainState,
  accountPortfolio,
  signAccountOpState,
  networkId,
  disabled
}: Props) => {
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
    const opts = signAccountOpState.availableFeeOptions.map((feeOption) => {
      const account = mainState.accounts.find((acc) => acc.addr === feeOption.paidBy)

      // the logic below may seem overextended but please proceed
      // with caution if you wish to make it more tidy. Especially the
      // checkNetworkIfNative var. If the code is copied in the final return
      // statement, it stops working as it should and it starts returning
      // always true
      const token = accountPortfolio?.tokens.find((t) => {
        if (!feeOption.isGasTank) {
          return t.address === feeOption.address && t.networkId === networkId && !t.flags.onGasTank
        }

        // native fee tokens should be from the same network
        // other gas tank tokens (USDT, USDC) have a networkId of ethereum
        // hardcoded. We should skip network check for them
        const checkNetworkIfNative =
          feeOption.address === '0x0000000000000000000000000000000000000000'
            ? t.networkId === networkId
            : true
        return t.address === feeOption.address && t.flags.onGasTank && checkNetworkIfNative
      })

      // TODO: validate - should never happen but there are some cases in which account is undefined
      if (!account || !token) return undefined

      const gasTankKey = token.flags.onGasTank === true ? 'gasTank' : ''
      return {
        value: feeOption.paidBy + feeOption.address + gasTankKey,
        label: <PayOption account={account} token={token} isGasTank={feeOption.isGasTank} />,
        paidBy: feeOption.paidBy,
        token
      }
    })

    return opts.filter((opt) => opt)
  }, [
    signAccountOpState.availableFeeOptions,
    mainState.accounts,
    accountPortfolio?.tokens,
    networkId
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

  const selectedFee = useMemo(
    () =>
      signAccountOpState.feeSpeeds.find(
        (speed) => speed.type === signAccountOpState.selectedFeeSpeed
      ),
    [signAccountOpState.selectedFeeSpeed, signAccountOpState.feeSpeeds]
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
      {signAccountOpState.feeSpeeds.length > 0 && (
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
            {signAccountOpState.feeSpeeds.map((fee, i) => (
              <Fee
                disabled={disabled}
                isLastItem={i === signAccountOpState.feeSpeeds.length - 1}
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
              <Text fontSize={16} weight="medium">
                {formatDecimals(parseFloat(selectedFee.amountFormatted))} {payValue.token?.symbol}
              </Text>
              <Text weight="medium" fontSize={16} appearance="primary">
                {' '}
                (~ ${formatDecimals(Number(selectedFee.amountUsd))})
              </Text>
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

export default Estimation
