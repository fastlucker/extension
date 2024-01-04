/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { MainController } from '@ambire-common/controllers/main/main'
import {
  SignAccountOpController,
  SigningStatus
} from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'
import useBackgroundService from '@web/hooks/useBackgroundService'
import PayOption from '@web/modules/sign-account-op/components/Estimation/components/PayOption'
import Fee from '@web/modules/sign-account-op/components/Fee'

import getStyles from './styles'

type Props = {
  mainState: MainController
  accountPortfolio: AccountPortfolio | null
  gasTankTokens: TokenResult[]
  signAccountOpState: SignAccountOpController
  networkId: NetworkDescriptor['id']
  isViewOnly: boolean
}

const Estimation = ({
  mainState,
  accountPortfolio,
  gasTankTokens,
  signAccountOpState,
  networkId,
  isViewOnly
}: Props) => {
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  const payOptions = useMemo(() => {
    const opts = signAccountOpState.availableFeeOptions.map((feeOption) => {
      const account = mainState.accounts.find((acc) => acc.addr === feeOption.paidBy)

      const token = feeOption.isGasTank
        ? gasTankTokens.find((t) => t.address === feeOption.address)
        : accountPortfolio?.tokens.find(
            (t) => t.address === feeOption.address && t.networkId === networkId
          )

      // TODO: validate - should never happen but there are some cases in which account is undefined
      if (!account || !token) return undefined

      return {
        value: feeOption.paidBy + feeOption.address,
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
      console.log(payValue.token)
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          feeToken: payValue.token,
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
        style={spacings.mb}
        value={payValue || {}}
        disabled={isViewOnly}
        defaultValue={payValue}
      />
      <View style={[spacings.mbMd]}>
        <Text fontSize={16} color={theme.secondaryText} style={spacings.mbTy}>
          {t('Transaction speed')}
        </Text>
        <View style={[maxWidthSize('xxl') && flexbox.directionRow, isViewOnly && { opacity: 0.6 }]}>
          {signAccountOpState.feeSpeeds.map((fee, i) => (
            <Fee
              isViewOnly={isViewOnly}
              isLastItem={i === signAccountOpState.feeSpeeds.length - 1}
              key={fee.amount + fee.type}
              label={`${t(fee.type.charAt(0).toUpperCase() + fee.type.slice(1))}:`}
              type={fee.type}
              amount={fee.amountFormatted}
              onPress={onFeeSelect}
              isSelected={signAccountOpState.selectedFeeSpeed === fee.type}
            />
          ))}
          {/* TODO: <CustomFee onPress={() => {}} /> */}
        </View>
      </View>
      <View>
        {!!selectedFee && !!payValue && (
          <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <Text fontSize={16} weight="medium" style={spacings.mrTy}>
                {t('Fee')}:
              </Text>
              <Text fontSize={16} weight="medium">
                {parseFloat(Number(selectedFee.amountFormatted).toFixed(6)).toString()}{' '}
                {payValue.token?.symbol}
              </Text>
              <Text weight="medium" fontSize={16} appearance="primary">
                {' '}
                (~ ${Number(selectedFee.amountUsd).toFixed(2)})
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
